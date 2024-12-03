const db = require('../database/connection'); 
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();
var fs = require('fs-extra');


function geraUrl2(e, userType) {
    const defaultProfileImageB = 'beekeeper.png';
    const defaultProfileImageF = 'farmer.png';
    const defaultProfileCover = 'default-cover.png';
    
    // Verificar se existe uma foto personalizada para o perfil
    const profileImage = e.Foto_Perfil ? e.Foto_Perfil : (userType === 1 ? defaultProfileImageB : defaultProfileImageF);
    const profileCover = userType === 1 ? e.Apic_Foto_Capa || defaultProfileCover : e.Agri_Foto_Capa || defaultProfileCover;

    // Construir URLs completas
    const API_URL = process.env.API_URL; // Base da URL
    return {
        profileImage: `${API_URL}/public/upload/perfil/${profileImage}`,
        profileCover: `${API_URL}/public/upload/perfil/${profileCover}`,
    };
}


function geraUrl(e, userType) {
    const defaultProfileImageB = 'beekeeper.png';
    const defaultProfileImageF = 'farmer.png';
    const defaultProfileCover = 'default-cover.png';
    const profileImage = userType === 1 ? e.Apic_Foto_Perfil || defaultProfileImageB : e.Agri_Foto_Perfil || defaultProfileImageF;
    const profileCover = userType === 1 ? e.Apic_Foto_Capa || defaultProfileCover : e.Agri_Foto_Capa || defaultProfileCover;

    // Construir URLs completas
    const API_URL = process.env.API_URL; // Base da URL
    return {
        profileImage: `${API_URL}/public/upload/perfil/${profileImage}`,
        profileCover: `${API_URL}/public/upload/perfil/${profileCover}`,
    };
}



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

                const imageUrls = geraUrl(additionalData);
    
                // Combinar os dados do usuário com os dados adicionais
                return response.status(200).json({
                    sucesso: true,
                    mensagem: 'Dados do usuário carregados com sucesso.',
                    dados: {
                        ...user[0][0],
                        ...additionalData,
                        ...imageUrls
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
            const sqlApicultor = 
                `SELECT Apic_Biografia, Apic_Foto_Perfil, Apic_Foto_Capa 
                FROM Apicultor WHERE Usu_Id = ?;`;
            const apicultorData = await db.query(sqlApicultor, [Usu_Id]);
            additionalData = apicultorData[0][0];
            const sqlApiario = 
                `SELECT Apia_Id, Apia_Nome, Apia_Caixas, Apia_Lat, Apia_Lng 
                FROM Apiarios WHERE Apic_Id = (
                    SELECT Apic_Id FROM Apicultor WHERE Usu_Id = ?);`;
            const apiarioData = await db.query(sqlApiario, [Usu_Id]);
            if (apiarioData[0].length > 0) {
                const apiario = apiarioData[0][0];
                nameApiary = apiario.Apia_Nome || '';
                availability = apiario.Apia_Caixas || 0;
                lat = apiario.Apia_Lat || null;
                lng = apiario.Apia_Lng || null;
                const sqlEspecies = 
                    `SELECT Espe_Id FROM Especie_Apiario 
                    WHERE Apia_Id = ? AND Espe_Apia_Ativo = 1;`;
                const especies = await db.query(sqlEspecies, [apiario.Apia_Id]);
                especiesSelecionadas = especies[0].map((e) => e.Espe_Id);
            }
        } else if (Usu_Tipo === 2) { // Agricultor
            const sqlAgricultor = 
                `SELECT Agri_Biografia, Agri_Foto_Perfil, Agri_Foto_Capa 
                FROM Agricultor WHERE Usu_Id = ?;`;
            const agricultorData = await db.query(sqlAgricultor, [Usu_Id]);
            additionalData = agricultorData[0][0];
            const sqlPropriedade = 
                `SELECT Prop_Id, Prop_Nome, Prop_Hectare, Prop_Lat, Prop_Lng 
                FROM Propriedade WHERE Agri_Id = (
                    SELECT Agri_Id FROM Agricultor WHERE Usu_Id = ?);`;
            const propriedadeData = await db.query(sqlPropriedade, [Usu_Id]);
            if (propriedadeData[0].length > 0) {
                const propriedade = propriedadeData[0][0];
                nameFarm = propriedade.Prop_Nome || '';
                hectares = propriedade.Prop_Hectare || 0;
                lat = propriedade.Prop_Lat || null;
                lng = propriedade.Prop_Lng || null;
                const sqlCultivos = 
                    `SELECT Cult_Id FROM Cultivo_Propriedade 
                    WHERE Prop_Id = ? AND Cult_Prop_Ativo = 1;`;
                const cultivos = await db.query(sqlCultivos, [propriedade.Prop_Id]);
                cultivosSelecionados = cultivos[0].map((c) => c.Cult_Id);
            }
        }

        const imageUrls = geraUrl(additionalData, Usu_Tipo);

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
                ...imageUrls
            },
        });
    } catch (error) {
        return response.status(500).json({
            sucesso: false,
            mensagem: 'Erro ao carregar os dados do usuário.',
            dados: error.message,
        });
    }
},
async atualizarDadosUsuario(request, response) {
    try {
        const { Usu_Id } = request.params;
        const {
            name,
            description,
            userType,
            nameApiary,
            nameFarm,
            hectares,
            availability,
            lat,
            lng,
            city,
            state,
            cultivosSelecionados = [],
            especiesSelecionadas = [],
        } = request.body;
        
        console.log("Iniciando atualização para Usu_Id:", Usu_Id);
        
        // Atualizar informações gerais do usuário
        const sqlUpdateUsuario = `UPDATE Usuario SET Usu_NomeCompleto = ? WHERE Usu_Id = ?;`;
        await db.query(sqlUpdateUsuario, [name, Usu_Id]);
        console.log("Atualizado nome do usuário:", name);
        

        if (userType === 1) {
            // Apicultor e Apiário
            const sqlUpdateApicultor = 
                `UPDATE Apicultor 
                SET Apic_Biografia = ?
                WHERE Usu_Id = ?;`;
            await db.query(sqlUpdateApicultor, [description, Usu_Id]);
            console.log("Atualizado Apicultor para Usu_Id:", Usu_Id);
            
            // Atualizar Apiário
            const apiaIdResult = await db.query(
                `SELECT Apia_Id FROM Apiarios WHERE Apic_Id = (SELECT Apic_Id FROM Apicultor WHERE Usu_Id = ?);`,
                [Usu_Id]
            );
            if (apiaIdResult[0].length === 0) {
                throw new Error(`Apiário não encontrado para Usu_Id ${Usu_Id}`);
            }
            const apiaId = apiaIdResult[0][0].Apia_Id;
            const sqlUpdateApiario = 
                `UPDATE Apiarios
                SET Apia_Nome = ?, Apia_Caixas = ?, Apia_Lat = ?, Apia_Lng = ?, Apia_Cidade = ?, Apia_Estado = ?
                WHERE Apia_Id = ?;`;
            await db.query(sqlUpdateApiario, [nameApiary, availability, lat, lng, city, state, apiaId]);
            console.log("Atualizado Apiário:", apiaId);
            
            // Atualizar espécies no Apiário
            const sqlDeleteEspecies = 'DELETE FROM Especie_Apiario WHERE Apia_Id = ?;';
            await db.query(sqlDeleteEspecies, [apiaId]);
            console.log("Especies antigas removidas para Apiário:", apiaId);
            
            if (especiesSelecionadas.length > 0) {
                const sqlInsertEspecies = 
                    `INSERT INTO Especie_Apiario (Apia_Id, Espe_Id, Espe_Apia_Ativo)
                    VALUES (?, ?, 1);`;
                for (const especieId of especiesSelecionadas) {
                    await db.query(sqlInsertEspecies, [apiaId, especieId]);
                }
                console.log("Especies atualizadas:", especiesSelecionadas);
            }
        } else if (userType === 2) {
            // Agricultor e Propriedade
            const sqlUpdateAgricultor = 
                `UPDATE Agricultor 
                SET Agri_Biografia = ?
                WHERE Usu_Id = ?;`;
            await db.query(sqlUpdateAgricultor, [description, Usu_Id]);

            const propriedadeIdResult = await db.query(
                `SELECT Prop_Id FROM Propriedade WHERE Agri_Id = (SELECT Agri_Id FROM Agricultor WHERE Usu_Id = ?);`,
                [Usu_Id]
            );
            if (propriedadeIdResult[0].length === 0) {
                throw new Error(`Propriedade não encontrada para Usu_Id ${Usu_Id}`);
            }
            const propId = propriedadeIdResult[0][0].Prop_Id;
            const sqlUpdatePropriedade = 
            `UPDATE Propriedade
                SET Prop_Nome = ?, Prop_Hectare = ?, Prop_Lat = ?, Prop_Lng = ?, Prop_Cidade = ?, Prop_Estado = ?
                WHERE Prop_Id = ?;` 
            await db.query(sqlUpdatePropriedade, [nameFarm, hectares, lat, lng, city, state, propId]);

            // Atualizar cultivos na propriedade
            const sqlDeleteCultivos = `DELETE FROM Cultivo_Propriedade WHERE Prop_Id = ?;`;
            await db.query(sqlDeleteCultivos, [propId]);

            if (cultivosSelecionados.length > 0) {
                const sqlInsertCultivos = 
                `INSERT INTO Cultivo_Propriedade (Prop_Id, Cult_Id, Cult_Prop_Ativo)
                    VALUES (?, ?, 1);`;
                for (const cultivoId of cultivosSelecionados) {
                    await db.query(sqlInsertCultivos, [propId, cultivoId]);
                }
            }
        }

        return response.status(200).json({
            sucesso: true,
            mensagem: 'Dados do usuário atualizados com sucesso.',
        });
    } catch (error) {
        return response.status(500).json({
            sucesso: false,
            mensagem: 'Erro ao atualizar os dados do usuário.',
            dados: error.message,
        });
    }
},

async listarUsuariosRecomendados(request, response) {
    try {
        const { Usu_Id } = request.params;
        
        // Buscar tipo do usuário logado
        const sqlUser = `SELECT Usu_Tipo FROM Usuario WHERE Usu_Id = ? AND Usu_Ativo = 1;`;
        const [userResult] = await db.query(sqlUser, [Usu_Id]);

        if (userResult.length === 0) {
            return response.status(404).json({
                sucesso: false,
                mensagem: 'Usuário não encontrado ou inativo.',
            });
        }

        const userType = userResult[0].Usu_Tipo;
        const recommendedUserType = userType === 1 ? 2 : 1; // Apicultor (1) recomenda Agricultor (2) e vice-versa

        // Buscar usuários do tipo recomendado e as fotos de perfil
        const sqlRecommended = `
            SELECT u.Usu_Id, u.Usu_NomeCompleto, u.Usu_Tipo, 
                CASE 
                    WHEN u.Usu_Tipo = 1 THEN a.Apic_Foto_Perfil
                    WHEN u.Usu_Tipo = 2 THEN ag.Agri_Foto_Perfil
                END AS Foto_Perfil
            FROM Usuario u
            LEFT JOIN Apicultor a ON u.Usu_Id = a.Usu_Id AND u.Usu_Tipo = 1
            LEFT JOIN Agricultor ag ON u.Usu_Id = ag.Usu_Id AND u.Usu_Tipo = 2
            WHERE u.Usu_Tipo = ? AND u.Usu_Ativo = 1 
            ORDER BY RAND() LIMIT 10;
        `;
        const [recommendedUsers] = await db.query(sqlRecommended, [recommendedUserType]);

        const usersWithUrls = recommendedUsers.map((user) => {
            const urls = geraUrl2(user, user.Usu_Tipo); // Gerar a URL completa para as fotos
            return { ...user, ...urls };
        });

        return response.status(200).json({
            sucesso: true,
            mensagem: 'Usuários recomendados encontrados.',
            dados: usersWithUrls,
        });
    } catch (error) {
        return response.status(500).json({
            sucesso: false,
            mensagem: 'Erro ao buscar usuários recomendados.',
            dados: error.message,
        });
    }
},


async listarUsuariosFavoritados(request, response) {
    try {
        const { Usu_Id } = request.params;

        const sqlFavorites = `
            SELECT u.Usu_Id, u.Usu_NomeCompleto, u.Usu_Tipo, 
                CASE 
                    WHEN u.Usu_Tipo = 1 THEN a.Apic_Foto_Perfil
                    WHEN u.Usu_Tipo = 2 THEN ag.Agri_Foto_Perfil
                END AS Foto_Perfil
            FROM Conexao c
            INNER JOIN Usuario u ON u.Usu_Id = c.Usu_Id_seguindo
            LEFT JOIN Apicultor a ON u.Usu_Id = a.Usu_Id AND u.Usu_Tipo = 1
            LEFT JOIN Agricultor ag ON u.Usu_Id = ag.Usu_Id AND u.Usu_Tipo = 2
            WHERE c.Usu_Id_segue = ? AND u.Usu_Ativo = 1;
        `;
        const [favoriteUsers] = await db.query(sqlFavorites, [Usu_Id]);

        const usersWithUrls = favoriteUsers.map((user) => {
            const urls = geraUrl2(user, user.Usu_Tipo); // Gerar a URL completa para as fotos
            return { ...user, ...urls };
        });

        return response.status(200).json({
            sucesso: true,
            mensagem: 'Usuários favoritados encontrados.',
            dados: usersWithUrls,
        });
    } catch (error) {
        return response.status(500).json({
            sucesso: false,
            mensagem: 'Erro ao buscar usuários favoritados.',
            dados: error.message,
        });
    }
},

async listarUsuariosProximos(request, response) {
    try {
        const { Usu_Id } = request.params;

        const sqlLocation = `
            SELECT 
                Usu_Tipo,
                CASE 
                    WHEN Usu_Tipo = 1 THEN (SELECT Apia_Lat FROM Apiarios WHERE Apic_Id = (SELECT Apic_Id FROM Apicultor WHERE Usu_Id = ?))
                    WHEN Usu_Tipo = 2 THEN (SELECT Prop_Lat FROM Propriedade WHERE Agri_Id = (SELECT Agri_Id FROM Agricultor WHERE Usu_Id = ?))
                END AS latitude,
                CASE 
                    WHEN Usu_Tipo = 1 THEN (SELECT Apia_Lng FROM Apiarios WHERE Apic_Id = (SELECT Apic_Id FROM Apicultor WHERE Usu_Id = ?))
                    WHEN Usu_Tipo = 2 THEN (SELECT Prop_Lng FROM Propriedade WHERE Agri_Id = (SELECT Agri_Id FROM Agricultor WHERE Usu_Id = ?))
                END AS longitude
            FROM Usuario
            WHERE Usu_Id = ? AND Usu_Ativo = 1;
        `;
        const [locationResult] = await db.query(sqlLocation, [Usu_Id, Usu_Id, Usu_Id, Usu_Id, Usu_Id]);

        if (locationResult.length === 0) {
            return response.status(404).json({
                sucesso: false,
                mensagem: 'Localização do usuário não encontrada.',
            });
        }

        const { latitude, longitude, Usu_Tipo } = locationResult[0];
        const otherUserType = Usu_Tipo === 1 ? 2 : 1;

        const sqlNearbyUsers = `
            SELECT u.Usu_Id, u.Usu_NomeCompleto, u.Usu_Tipo,
            CASE 
                WHEN u.Usu_Tipo = 1 THEN (SELECT Apia_Lat FROM Apiarios WHERE Apic_Id = (SELECT Apic_Id FROM Apicultor WHERE Usu_Id = u.Usu_Id))
                WHEN u.Usu_Tipo = 2 THEN (SELECT Prop_Lat FROM Propriedade WHERE Agri_Id = (SELECT Agri_Id FROM Agricultor WHERE Usu_Id = u.Usu_Id))
            END AS latitude,
            CASE 
                WHEN u.Usu_Tipo = 1 THEN (SELECT Apia_Lng FROM Apiarios WHERE Apic_Id = (SELECT Apic_Id FROM Apicultor WHERE Usu_Id = u.Usu_Id))
                WHEN u.Usu_Tipo = 2 THEN (SELECT Prop_Lng FROM Propriedade WHERE Agri_Id = (SELECT Agri_Id FROM Agricultor WHERE Usu_Id = u.Usu_Id))
            END AS longitude,
            CASE 
                WHEN u.Usu_Tipo = 1 THEN a.Apic_Foto_Perfil
                WHEN u.Usu_Tipo = 2 THEN ag.Agri_Foto_Perfil
            END AS Foto_Perfil
            FROM Usuario u
            LEFT JOIN Apicultor a ON u.Usu_Id = a.Usu_Id AND u.Usu_Tipo = 1
            LEFT JOIN Agricultor ag ON u.Usu_Id = ag.Usu_Id AND u.Usu_Tipo = 2
            WHERE u.Usu_Tipo = ? AND u.Usu_Ativo = 1
            HAVING latitude IS NOT NULL AND longitude IS NOT NULL
            ORDER BY 
                (6371 * acos(cos(radians(?)) * cos(radians(latitude)) * cos(radians(longitude) - radians(?)) + sin(radians(?)) * sin(radians(latitude))))
            LIMIT 10;
        `;
        const [nearbyUsers] = await db.query(sqlNearbyUsers, [otherUserType, latitude, longitude, latitude]);

        const usersWithUrls = nearbyUsers.map((user) => {
            const urls = geraUrl2(user, user.Usu_Tipo); // Gerar a URL completa para as fotos
            return { ...user, ...urls };
        });

        return response.status(200).json({
            sucesso: true,
            mensagem: 'Usuários próximos encontrados.',
            dados: usersWithUrls,
        });
    } catch (error) {
        return response.status(500).json({
            sucesso: false,
            mensagem: 'Erro ao buscar usuários próximos.',
            dados: error.message,
        });
    }
},
async pesquisarUsuarios(request, response) {
    try {
        const { searchQuery, userType } = request.query;
        
        console.log("Parâmetros recebidos:", { searchQuery, userType }); // Log de depuração

        const sql = `
            SELECT u.Usu_Id, u.Usu_NomeCompleto, u.Usu_Tipo, 
                   CASE 
                       WHEN u.Usu_Tipo = 1 THEN a.Apic_Foto_Perfil
                       WHEN u.Usu_Tipo = 2 THEN ag.Agri_Foto_Perfil
                   END AS Foto_Perfil
            FROM Usuario u
            LEFT JOIN Apicultor a ON u.Usu_Id = a.Usu_Id AND u.Usu_Tipo = 1
            LEFT JOIN Agricultor ag ON u.Usu_Id = ag.Usu_Id AND u.Usu_Tipo = 2
            WHERE u.Usu_Tipo = ? AND u.Usu_Ativo = 1 AND u.Usu_NomeCompleto LIKE CONCAT('%', ?, '%')
            LIMIT 10;
        `;

        const [result] = await db.query(sql, [userType === '1' ? 1 : 2, searchQuery]);

        console.log("Resultado da consulta:", result); // Log de depuração

        if (result.length === 0) {
            return response.status(404).json({
                sucesso: false,
                mensagem: 'Usuário não encontrado ou inativo.',
            });
        }

        return response.json({ sucesso: true, dados: result });
    } catch (error) {
        console.error("Erro ao buscar usuários:", error);
        return response.status(500).json({ sucesso: false, mensagem: "Erro ao buscar usuários." });
    }
}



}