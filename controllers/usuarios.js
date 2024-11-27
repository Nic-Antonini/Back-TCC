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
                        mensagem: 'Este e-mail já está cadastrado.',
                    });
                }
        
                // Criptografar a senha
                const hashedPassword = await bcrypt.hash(Usu_Senha, 10);
        
                // Inserir o usuário na tabela Usuario
                const sql = `INSERT INTO Usuario (Usu_NomeCompleto, Usu_Email, Usu_Senha, Usu_Tipo) VALUES (?,?,?,?)`;
                const values = [Usu_NomeCompleto, Usu_Email, hashedPassword, Usu_Tipo];
                const execSql = await db.query(sql, values);
                const Usu_Id = execSql[0].insertId;
        
                if (Usu_Tipo === 1) { // Apicultor
                    // Inserir apicultor
                    const sqlInsertApicultor = `
                        INSERT INTO Apicultor (Apic_Foto_Perfil, Apic_Foto_Capa, Apic_Biografia, Usu_Id) 
                        VALUES (?, ?, ?, ?)`;
                    const valuesApicultor = ['beekeeper.png', 'default-cover.png', 'Fale mais sobre você', Usu_Id];
                    const apicultorResult = await db.query(sqlInsertApicultor, valuesApicultor);
        
                    // Criar um apiário padrão sem espécies associadas
                    const sqlInsertApiario = `
                        INSERT INTO Apiarios (Apia_Nome, Apia_Cidade, Apia_Estado, Apia_Lat, Apia_Lng, Apia_Caixas, Apia_Ativo, Apic_Id)
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
                    const Apic_Id = apicultorResult[0].insertId;
                    await db.query(sqlInsertApiario, ['Nome do seu apiário', 'Cidade', 'Estado', -15.7942, -47.8822, 0, true, Apic_Id]);
        
                    // Sem espécies padrão associadas ao apiário
                } else if (Usu_Tipo === 2) { // Agricultor
                    // Inserir agricultor
                    const sqlInsertAgricultor = `
                        INSERT INTO Agricultor (Agri_Foto_Perfil, Agri_Foto_Capa, Agri_Biografia, Usu_Id) 
                        VALUES (?, ?, ?, ?)`;
                    const valuesAgricultor = ['farmer.png', 'default-cover.png', 'Fale mais sobre você', Usu_Id];
                    const agricultorResult = await db.query(sqlInsertAgricultor, valuesAgricultor);
        
                    // Criar uma propriedade padrão sem cultivos associados
                    const sqlInsertPropriedade = `
                        INSERT INTO Propriedade (Prop_Nome, Prop_Cidade, Prop_Estado, Prop_Lat, Prop_Lng, Prop_Hectare, Prop_Ativo, Agri_Id)
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
                    const Agri_Id = agricultorResult[0].insertId;
                    await db.query(sqlInsertPropriedade, ['Nome da sua propriedade', 'Cidade', 'Estado', -15.7942, -47.8822, 0.0, true, Agri_Id]);
        
                    // Sem cultivos padrão associados à propriedade
                }
        
                return response.status(200).json({
                    sucesso: true,
                    mensagem: 'Cadastro de usuário realizado com sucesso.',
                    dados: Usu_Id,
                });
            } catch (error) {
                return response.status(500).json({
                    sucesso: false,
                    mensagem: 'Erro na requisição.',
                    dados: error.message,
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
    try {
        const { Usu_Id } = request.params;

        // Buscar dados do usuário
        const sqlUser = `SELECT Usu_Id, Usu_NomeCompleto, Usu_Email, Usu_Tipo FROM Usuario WHERE Usu_Id = ? AND Usu_Ativo = 1;`;
        const user = await db.query(sqlUser, [Usu_Id]);

        if (user[0].length === 0) {
            return response.status(404).json({
                sucesso: false,
                mensagem: 'Usuário não encontrado ou inativo.',
            });
        }

        const { Usu_Tipo } = user[0][0];

        let additionalData = {};
        let cultivosSelecionados = [];
        let especiesSelecionadas = [];
        let nameFarm = '';
        let hectares = 0;
        let nameApiary = '';
        let availability = 0;
        let lat = null;
        let lng = null;

        if (Usu_Tipo === 1) { // Apicultor
            const sqlApicultor = `
                SELECT Apic_Biografia, Apic_Foto_Perfil, Apic_Foto_Capa 
                FROM Apicultor WHERE Usu_Id = ?;`;
            const apicultorData = await db.query(sqlApicultor, [Usu_Id]);
            additionalData = apicultorData[0][0];

            const sqlApiario = `
                SELECT Apia_Id, Apia_Nome, Apia_Caixas, Apia_Lat, Apia_Lng 
                FROM Apiarios WHERE Apic_Id = (
                    SELECT Apic_Id FROM Apicultor WHERE Usu_Id = ?
                );`;
            const apiarioData = await db.query(sqlApiario, [Usu_Id]);

            if (apiarioData[0].length > 0) {
                const apiario = apiarioData[0][0];
                nameApiary = apiario.Apia_Nome || '';
                availability = apiario.Apia_Caixas || 0;
                lat = apiario.Apia_Lat || null;
                lng = apiario.Apia_Lng || null;

                const sqlEspecies = `
                    SELECT Espe_Id FROM Especie_Apiario 
                    WHERE Apia_Id = ? AND Espe_Apia_Ativo = 1;`;
                const especies = await db.query(sqlEspecies, [apiario.Apia_Id]);
                especiesSelecionadas = especies[0].map((e) => e.Espe_Id);
            }
        } else if (Usu_Tipo === 2) { // Agricultor
            const sqlAgricultor = `
                SELECT Agri_Biografia, Agri_Foto_Perfil, Agri_Foto_Capa 
                FROM Agricultor WHERE Usu_Id = ?;`;
            const agricultorData = await db.query(sqlAgricultor, [Usu_Id]);
            additionalData = agricultorData[0][0];

            const sqlPropriedade = `
                SELECT Prop_Id, Prop_Nome, Prop_Hectare, Prop_Lat, Prop_Lng 
                FROM Propriedade WHERE Agri_Id = (
                    SELECT Agri_Id FROM Agricultor WHERE Usu_Id = ?
                );`;
            const propriedadeData = await db.query(sqlPropriedade, [Usu_Id]);

            if (propriedadeData[0].length > 0) {
                const propriedade = propriedadeData[0][0];
                nameFarm = propriedade.Prop_Nome || '';
                hectares = propriedade.Prop_Hectare || 0;
                lat = propriedade.Prop_Lat || null;
                lng = propriedade.Prop_Lng || null;

                const sqlCultivos = `
                    SELECT Cult_Id FROM Cultivo_Propriedade 
                    WHERE Prop_Id = ? AND Cult_Prop_Ativo = 1;`;
                const cultivos = await db.query(sqlCultivos, [propriedade.Prop_Id]);
                cultivosSelecionados = cultivos[0].map((c) => c.Cult_Id);
            }
        }

        return response.status(200).json({
            sucesso: true,
            mensagem: 'Dados do usuário carregados com sucesso.',
            dados: {
                ...user[0][0],
                ...additionalData,
                cultivosSelecionados,
                especiesSelecionadas,
                nameFarm,
                hectares,
                nameApiary,
                availability,
                lat,
                lng,
            },
        });
    } catch (error) {
        return response.status(500).json({
            sucesso: false,
            mensagem: 'Erro ao carregar os dados do usuário.',
            dados: error.message,
        });
    }
}

}