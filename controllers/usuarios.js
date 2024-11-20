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
            const {Usu_NomeCompleto, Usu_Email, Usu_Senha, Usu_Tipo} = request.body;

            const sqlCheckEmail = `SELECT * FROM Usuario WHERE Usu_Email = ?`;
            const existingUser = await db.query(sqlCheckEmail, [Usu_Email]);

            if (existingUser[0].length > 0) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'Este e-mail já está cadastrado.'
                });
            }

            const hashedPassword = await bcrypt.hash(Usu_Senha, 10);
            
            const sql = `INSERT INTO Usuario
                (Usu_NomeCompleto, Usu_Email, Usu_Senha, Usu_Tipo)
                VALUES (?,?,?,?)`;
                

            const values = [Usu_NomeCompleto, Usu_Email, hashedPassword, Usu_Tipo]
            const execSql = await db.query(sql,values);
            const Usu_Id = execSql[0].insertId;

            if (Usu_Tipo === 1) {
                // Apicultor
                const sqlInsertApicultor = `
                    INSERT INTO Apicultor (Apic_Foto_Perfil, Apic_Foto_Capa, Apic_Biografia, Usu_Id) 
                    VALUES (?, ?, ?, ?)`;
                const valuesApicultor = ['beekeeper.png', 'default-cover.png', 'Fale mais sobre você', Usu_Id];
                await db.query(sqlInsertApicultor, valuesApicultor);
            } else if (Usu_Tipo === 2) {
                // Agricultor
                const sqlInsertAgricultor = `
                    INSERT INTO Agricultor (Agri_Foto_Perfil, Agri_Foto_Capa, Agri_Biografia, Usu_Id) 
                    VALUES (?, ?, ?, ?)`;
                const valuesAgricultor = ['farmer.png', 'default-cover.png', 'Fale mais sobre você', Usu_Id];
                await db.query(sqlInsertAgricultor, valuesAgricultor);
            }


            return response.status(200).json({
                sucesso: true, 
                mensagem: 'Cadastro de usuários.', 
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

        // Criação do token JWT
        const token = jwt.sign({
            userId: user[0][0].Usu_Id,
            userType: user[0][0].Usu_Tipo,
            email: user[0][0].Usu_Email
        }, 'secrect_key', { expiresIn: '3h' }); // '3h' -> token expira em s horas

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
}

}