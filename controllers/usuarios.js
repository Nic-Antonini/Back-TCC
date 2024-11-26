const db = require('../database/connection'); 
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

module.exports = {
    async listarUsuarios(request, response) {
        try {     
            const sql = `SELECT
                Usu_id, Usu_NomeCompleto, Usu_Email,
                Usu_Senha, Usu_Tipo, Usu_Ativo
                FROM Usuario
                WHERE Usu_Ativo = 1;`;     
                
            const usuarios = await db.query(sql);

            const nItens = usuarios[0].length;


            return response.status(200).json({
                sucesso: true, 
                mensagem: 'Lista de usuários.', 
                dados: usuarios[0],
                nItens
            });
            
        } catch (error) {
            return response.status(500).json({
                sucesso: false,
                mensagem: 'Erro na requisição.',
                dados: error.message
            });
        }
    }, 
        async listarUsuarioPorId(request, response) {
            try {
                const { Usu_Id } = request.params;
    
                // Verificar se o usuário existe
                const sqlUser = `SELECT Usu_Id, Usu_NomeCompleto, Usu_Email, Usu_Tipo FROM Usuario WHERE Usu_Id = ? AND Usu_Ativo = 1;`;
                const user = await db.query(sqlUser, [Usu_Id]);
    
                if (user[0].length === 0) {
                    return response.status(404).json({
                        sucesso: false,
                        mensagem: 'Usuário não encontrado ou inativo.'
                    });
                }
    
                const { Usu_Tipo } = user[0][0];
    
                // Verificar dados adicionais (Apicultor ou Agricultor)
                let additionalData = {};
                if (Usu_Tipo === 1) {
                    // Apicultor
                    const sqlApicultor = `
                        SELECT Apic_Biografia, Apic_Foto_Perfil, Apic_Foto_Capa
                        FROM Apicultor
                        WHERE Usu_Id = ?;
                    `;
                    const apicultorData = await db.query(sqlApicultor, [Usu_Id]);
                    additionalData = apicultorData[0][0];
                } else if (Usu_Tipo === 2) {
                    // Agricultor
                    const sqlAgricultor = `
                        SELECT Agri_Biografia, Agri_Foto_Perfil, Agri_Foto_Capa
                        FROM Agricultor
                        WHERE Usu_Id = ?;
                    `;
                    const agricultorData = await db.query(sqlAgricultor, [Usu_Id]);
                    additionalData = agricultorData[0][0];
                }
    
                // Combinar os dados do usuário com os dados adicionais
                return response.status(200).json({
                    sucesso: true,
                    mensagem: 'Dados do usuário carregados com sucesso.',
                    dados: {
                        ...user[0][0],
                        ...additionalData
                    }
                });
            } catch (error) {
                return response.status(500).json({
                    sucesso: false,
                    mensagem: 'Erro ao carregar os dados do usuário.',
                    dados: error.message
                });
            }
        },
    
        async cadastrarUsuarios(request, response) {
            try {
                const { Usu_NomeCompleto, Usu_Email, Usu_Senha, Usu_Tipo } = request.body;
    
                // Verificar se o email já existe
                const sqlCheckEmail = `SELECT * FROM Usuario WHERE Usu_Email = ?`;
                const existingUser = await db.query(sqlCheckEmail, [Usu_Email]);
    
                if (existingUser[0].length > 0) {
                    return response.status(400).json({
                        sucesso: false,
                        mensagem: 'Este e-mail já está cadastrado.'
                    });
                }
    
                // Criptografar a senha
                const hashedPassword = await bcrypt.hash(Usu_Senha, 10);
                
                // Inserir o usuário na tabela Usuario
                const sql = `INSERT INTO Usuario (Usu_NomeCompleto, Usu_Email, Usu_Senha, Usu_Tipo) VALUES (?,?,?,?)`;
                const values = [Usu_NomeCompleto, Usu_Email, hashedPassword, Usu_Tipo];
                const execSql = await db.query(sql, values);
                const Usu_Id = execSql[0].insertId;
    
                // Inserir dados padrões para Apicultor ou Agricultor
                if (Usu_Tipo === 1) {
                    // Apicultor
                    const sqlInsertApicultor = `
                        INSERT INTO Apicultor (Apic_Foto_Perfil, Apic_Foto_Capa, Apic_Biografia, Usu_Id) 
                        VALUES (?, ?, ?, ?)`;
                    const valuesApicultor = ['beekeeper.png', 'default-cover.png', 'Fale mais sobre você', Usu_Id];
                    const apicultorResult = await db.query(sqlInsertApicultor, valuesApicultor);
                    const Apic_Id = apicultorResult[0].insertId;
    
                    // Criar um Apiário padrão
                    const sqlInsertApiario = `
                        INSERT INTO Apiarios (Apia_Nome, Apia_Cidade, Apia_Estado, Apia_Lat, Apia_Lng, Apia_Caixas, Apia_Ativo, Apic_Id)
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
                    const valuesApiario = ['Nome do Apiário', 'Cidade', 'Estado', -15.7942, -47.8822, 0, true, Apic_Id];
                    const apiarioResult = await db.query(sqlInsertApiario, valuesApiario);
                    const Apia_Id = apiarioResult[0].insertId;
    
                    // Inserir uma espécie padrão (pode ser fictícia)
                    const sqlInsertEspecie = `SELECT Espe_Id FROM Especie LIMIT 1;`;  // Pegando uma espécie qualquer
                    const especieResult = await db.query(sqlInsertEspecie);
                    const espeId = especieResult[0][0]?.Espe_Id;
    
                    if (espeId) {
                        const sqlInsertEspecieApiario = `
                            INSERT INTO Especie_Apiario (Apia_Id, Espe_Id, Espe_Apia_Ativo) 
                            VALUES (?, ?, ?);`;
                        await db.query(sqlInsertEspecieApiario, [Apia_Id, espeId, 1]);  // 1 significa ativo
                    }
    
                } else if (Usu_Tipo === 2) {
                    // Agricultor
                    const sqlInsertAgricultor = `
                        INSERT INTO Agricultor (Agri_Foto_Perfil, Agri_Foto_Capa, Agri_Biografia, Usu_Id) 
                        VALUES (?, ?, ?, ?)`;
                    const valuesAgricultor = ['farmer.png', 'default-cover.png', 'Fale mais sobre você', Usu_Id];
                    const agricultorResult = await db.query(sqlInsertAgricultor, valuesAgricultor);
                    const Agri_Id = agricultorResult[0].insertId;
    
                    // Criar uma Propriedade padrão
                    const sqlInsertPropriedade = `
                        INSERT INTO Propriedade (Prop_Nome, Prop_Cidade, Prop_Estado, Prop_Lat, Prop_Lng, Prop_Hectare, Prop_Ativo, Agri_Id)
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
                    const valuesPropriedade = ['Nome da Propriedade', 'Cidade', 'Estado', -15.7942, -47.8822, 0, true, Agri_Id];
                    const propriedadeResult = await db.query(sqlInsertPropriedade, valuesPropriedade);
                    const Prop_Id = propriedadeResult[0].insertId;
    
                    // Inserir um cultivo padrão
                    const sqlInsertCultivo = `SELECT Cult_Id FROM Cultivo LIMIT 1;`;  // Pegando um cultivo qualquer
                    const cultivoResult = await db.query(sqlInsertCultivo);
                    const cultId = cultivoResult[0][0]?.Cult_Id;
    
                    if (cultId) {
                        const sqlInsertCultivoPropriedade = `
                            INSERT INTO Cultivo_Propriedade (Cult_Id, Prop_Id, Cult_Prop_Ativo) 
                            VALUES (?, ?, ?);`;
                        await db.query(sqlInsertCultivoPropriedade, [cultId, Prop_Id, 1]);  // 1 significa ativo
                    }
                }
    
                return response.status(200).json({
                    sucesso: true,
                    mensagem: 'Cadastro de usuário realizado com sucesso.',
                    dados: Usu_Id
                });
    
            } catch (error) {
                return response.status(500).json({
                    sucesso: false,
                    mensagem: 'Erro na requisição.',
                    dados: error.message
                });
            }
        },
    

    async editarUsuarios(request, response) {
        try {    
            const {Usu_NomeCompleto, Usu_Email, Usu_Senha, Usu_Tipo, Usu_Ativo} = request.body;
            const {Usu_Id} = request.params;
            const sql= `UPDATE Usuario SET Usu_NomeCompleto = ?,  Usu_Email = ?, Usu_Senha = ?, Usu_Tipo = ?, Usu_Ativo = ?
                        WHERE Usu_Id = ?;`;
            const values = [Usu_NomeCompleto, Usu_Email, Usu_Senha, Usu_Tipo, Usu_Ativo, Usu_Id];
            const atualizaDados = await db.query (sql, values);

        
            return response.status(200).json({
                sucesso: true, 
                mensagem: `Usuário ${Usu_Id} atualizado com sucesso!`, 
                dados: atualizaDados[0].affectedRows
            });

        } catch (error) {
            return response.status(500).json({
                sucesso: false,
                mensagem: 'Erro na requisição.',
                dados: error.message
            });
        }
    }, 

    

async ocultarUsuario(request, response) {
    try {  
        const Usu_Ativo = false;
        const {Usu_Id} = request.params;
        const sql = `UPDATE Usuario SET usu_ativo = ?
            WHERE usu_id = ?;`;
        const values = [Usu_Ativo, Usu_Id];
        const atualizacao = await db.query(sql,values);

        return response.status(200).json({
            sucesso: true, 
            mensagem: `Usuário ${Usu_Id} excluído com sucesso`, 
            dados: atualizacao[0].affectedRows
        });

    } catch (error) {
        return response.status(500).json({
            sucesso: false,
            mensagem: 'Erro na requisição.',
            dados: error.message
        });
    }
},

async login(request, response) {
    try {
        const { email, password } = request.body;

        // Verifica se o usuário existe
        const sql = `SELECT * FROM Usuario WHERE Usu_Email = ? AND Usu_Ativo = 1;`;
        const user = await db.query(sql, [email]);

        if (user[0].length === 0) {
            return response.status(400).json({
                sucesso: false,
                mensagem: 'Email ou senha incorretos.'
            });
        }

        // Verifica a senha
        const isPasswordCorrect = await bcrypt.compare(password, user[0][0].Usu_Senha);
        if (!isPasswordCorrect) {
            return response.status(400).json({
                sucesso: false,
                mensagem: 'Email ou senha incorretos.'
            });
        }

        const { Usu_Id, Usu_Tipo, Usu_Email } = user[0][0];
        let additionalData = {};

        if (Usu_Tipo === 1) {
            // Apicultor
            const sqlApicultor = `SELECT Apic_Id FROM Apicultor WHERE Usu_Id = ?;`;
            const apicultorData = await db.query(sqlApicultor, [Usu_Id]);
            if (apicultorData[0].length > 0) {
                additionalData = { Apic_Id: apicultorData[0][0].Apic_Id };
            }
        } else if (Usu_Tipo === 2) {
            // Agricultor
            const sqlAgricultor = `SELECT Agri_Id FROM Agricultor WHERE Usu_Id = ?;`;
            const agricultorData = await db.query(sqlAgricultor, [Usu_Id]);
            if (agricultorData[0].length > 0) {
                additionalData = { Agri_Id: agricultorData[0][0].Agri_Id };
            }
        }

        // Criação do token JWT
        const token = jwt.sign({
            userId: Usu_Id,
            userType: Usu_Tipo,
            email: Usu_Email,
            ...additionalData
        }, 'secrect_key', { expiresIn: '3h' });

        return response.status(200).json({
            sucesso: true,
            mensagem: 'Login bem-sucedido.',
            token
        });

    } catch (error) {
        return response.status(500).json({
            sucesso: false,
            mensagem: 'Erro na requisição.',
            dados: error.message
        });
    }
},
async listarDadosUsuario(request, response) {
    const { Usu_Id } = request.params;  // Obtendo o Usu_Id da URL

    try {
        // Buscar o usuário na tabela Usuario
        const sqlUsuario = `SELECT * FROM Usuario WHERE Usu_Id = ?`;
        const usuario = await db.query(sqlUsuario, [Usu_Id]);

        if (usuario[0].length === 0) {
            return response.status(404).json({
                sucesso: false,
                mensagem: 'Usuário não encontrado.'
            });
        }

        const { Usu_Tipo } = usuario[0][0];

        if (Usu_Tipo === 1) {
            // Apicultor
            // Buscar dados da tabela Apicultor
            const sqlApicultor = `
                SELECT * FROM Apicultor WHERE Usu_Id = ?`;
            const apicultor = await db.query(sqlApicultor, [Usu_Id]);

            if (apicultor[0].length === 0) {
                return response.status(404).json({
                    sucesso: false,
                    mensagem: 'Dados do Apicultor não encontrados.'
                });
            }

            // Buscar dados de Apiários do Apicultor
            const sqlApiarios = `
                SELECT * FROM Apiarios WHERE Apic_Id = ?`;
            const apiarios = await db.query(sqlApiarios, [apicultor[0][0].Apic_Id]);

            // Buscar espécies associadas aos Apiários
            const sqlEspeciesApiario = `
                SELECT Especie.* FROM Especie
                INNER JOIN Especie_Apiario ON Especie_Apiario.Espe_Id = Especie.Espe_Id
                WHERE Especie_Apiario.Apia_Id IN (SELECT Apia_Id FROM Apiarios WHERE Apic_Id = ?)`;
            const especiesApiario = await db.query(sqlEspeciesApiario, [apicultor[0][0].Apic_Id]);

            return response.status(200).json({
                sucesso: true,
                dados: {
                    usuario: usuario[0][0],
                    apicultor: apicultor[0][0],
                    apiarios: apiarios[0],
                    especiesApiario: especiesApiario[0],
                }
            });

        } else if (Usu_Tipo === 2) {
            // Agricultor
            // Buscar dados da tabela Agricultor
            const sqlAgricultor = `
                SELECT * FROM Agricultor WHERE Usu_Id = ?`;
            const agricultor = await db.query(sqlAgricultor, [Usu_Id]);

            if (agricultor[0].length === 0) {
                return response.status(404).json({
                    sucesso: false,
                    mensagem: 'Dados do Agricultor não encontrados.'
                });
            }

            // Buscar dados de Propriedades do Agricultor
            const sqlPropriedades = `
                SELECT * FROM Propriedade WHERE Agri_Id = ?`;
            const propriedades = await db.query(sqlPropriedades, [agricultor[0][0].Agri_Id]);

            // Buscar cultivos associados às Propriedades
            const sqlCultivosPropriedade = `
                SELECT Cultivo.* FROM Cultivo
                INNER JOIN Cultivo_Propriedade ON Cultivo_Propriedade.Cult_Id = Cultivo.Cult_Id
                WHERE Cultivo_Propriedade.Prop_Id IN (SELECT Prop_Id FROM Propriedade WHERE Agri_Id = ?)`;
            const cultivosPropriedade = await db.query(sqlCultivosPropriedade, [agricultor[0][0].Agri_Id]);

            return response.status(200).json({
                sucesso: true,
                dados: {
                    usuario: usuario[0][0],
                    agricultor: agricultor[0][0],
                    propriedades: propriedades[0],
                    cultivosPropriedade: cultivosPropriedade[0],
                }
            });

        } else {
            return response.status(400).json({
                sucesso: false,
                mensagem: 'Tipo de usuário inválido.'
            });
        }

    } catch (error) {
        return response.status(500).json({
            sucesso: false,
            mensagem: 'Erro na requisição.',
            dados: error.message
        });
    }
},

}