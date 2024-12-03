const db = require('../database/connection');
const fs = require('fs-extra');

module.exports = {
    async listarAgricultor(request, response) {
        try {
            const { Agri_Id } = request.params; // Parâmetro da URL
    
            const sql = `
                SELECT 
                    ag.Agri_Id, 
                    u.Usu_NomeCompleto, 
                    ag.Agri_Foto_Perfil
                FROM 
                    Agricultor ag
                INNER JOIN 
                    Usuario u 
                ON 
                    ag.Usu_Id = u.Usu_Id
                WHERE 
                    ag.Agri_Id = ?
            `;
    
            const agricultorData = await db.query(sql, [Agri_Id]);
    
            if (agricultorData[0].length === 0) {
                return response.status(404).json({ sucesso: false, mensagem: "Agricultor não encontrado." });
            }
    
            return response.status(200).json({ sucesso: true, dados: agricultorData[0][0] });
        } catch (error) {
            return response.status(500).json({ sucesso: false, mensagem: error.message });
        }
    },

    async listarAgricultorPorId(request, response) {
        try {
            const { Usu_Id } = request.params; // Parâmetro da URL
    
            const sql = `
                SELECT 
                    ag.Agri_Id, 
                    u.Usu_NomeCompleto, 
                    ag.Agri_Foto_Perfil
                FROM 
                    Agricultor ag
                INNER JOIN 
                    Usuario u 
                ON 
                    ag.Usu_Id = u.Usu_Id
                WHERE 
                    ag.Usu_Id = ?
            `;
    
            const agricultorData = await db.query(sql, [Usu_Id]);
    
            if (agricultorData[0].length === 0) {
                return response.status(404).json({ sucesso: false, mensagem: "Agricultor não encontrado." });
            }
    
            return response.status(200).json({ sucesso: true, dados: agricultorData[0][0] });
        } catch (error) {
            return response.status(500).json({ sucesso: false, mensagem: error.message });
        }
    },


    async cadastrarAgricultor(request, response) {
        try {

            const {Usu_NomeCompleto, Usu_Email, Usu_Senha, Usu_Tipo, Agri_Foto_Perfil, Agri_Foto_Capa, Agri_Biografia} = request.body;
            
            const sql = `INSERT INTO Usuario
                (Usu_NomeCompleto, Usu_Email, Usu_Senha, Usu_Tipo)
                VALUES (?,?,?,?)`;
                

            const values = [Usu_NomeCompleto, Usu_Email, Usu_Senha, Usu_Tipo]
            const execSql = await db.query(sql,values);
            const Usu_Id = execSql[0].insertId;            

            const sql2 = `INSERT INTO Agricultor
                (Agri_Foto_Perfil, Agri_Foto_Capa, Agri_Biografia, Usu_Id)
                VALUES (?,?,?,?)`;


            const values2 = [Agri_Foto_Perfil, Agri_Foto_Capa, Agri_Biografia, Usu_Id]
            const execSql2 = await db.query(sql2, values2);
            const Agri_Id = execSql2[0].insertId;


            return response.status(200).json({
                sucesso: true,
                mensagem: 'Cadastro de Agricultores.',
                dados: Agri_Id
            });

        } catch (error) {
            return response.status(500).json({
                sucesso: false,
                mensagem: 'Erro na requisição.',
                dados: error.message
            });
        }
    },


    async editarAgricultor(request, response) {
        try {
            const { Agri_Id } = request.params;
            const { name, description } = request.body;

            const sqlUpdate = `
                UPDATE Agricultor 
                SET Agri_Biografia = ?, 
                    Agri_Foto_Perfil = ?, 
                    Agri_Foto_Capa = ?
                WHERE Agri_Id = ?;
            `;

            await db.query(sqlUpdate, [
                description || '',
                profileImage || '',
                coverImage || '',
                Agri_Id,
            ]);

            const sqlUserUpdate = `
                UPDATE Usuario
                SET Usu_NomeCompleto = ?
                WHERE Usu_Id = (SELECT Usu_Id FROM Agricultor WHERE Agri_Id = ?);
            `;

            await db.query(sqlUserUpdate, [name, Agri_Id]);

            return response.status(200).json({
                sucesso: true,
                mensagem: 'Perfil atualizado com sucesso!',
            });
        } catch (error) {
            console.error(error);
            return response.status(500).json({
                sucesso: false,
                mensagem: 'Erro ao atualizar o perfil.',
                dados: error.message,
            });
        }
    },

    async apagarAgricultor(request, response) {
        try {
            const { Usu_Id } = request.params;
            const sql = `UPDATE Usuario    Usu
                     INNER JOIN Agricultor Agr ON Usu.Usu_Id = Agr.Usu_id
                            SET Usu.Usu_Ativo = 0 
                          WHERE Agr.Agri_id = ?;`;
            const values = [Usu_Id]
            const excluir = await db.query(sql, values);

            return response.status(200).json({
                sucesso: true,
                mensagem: `Agricultor ${Usu_Id} excluído com sucesso`,
                dados: excluir[0].affectedRows
            });

        } catch (error) {
            return response.status(500).json({
                sucesso: false,
                mensagem: 'Erro na requisição.',
                dados: error.message
            });
        }
    },
}