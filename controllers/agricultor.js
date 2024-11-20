const db = require('../database/connection');
const fs = require('fs-extra');

module.exports = {
    async listarAgricultor(request, response) {
        try {
            const sql = `SELECT
            ag.Agri_Id, us.Usu_NomeCompleto, ag.Agri_Foto_Perfil, ag.Agri_Foto_Capa,
            ag.Agri_Biografia, ag.Usu_Id
            FROM Agricultor ag 
            INNER JOIN usuario us ON us.Usu_Id = ag.Usu_Id 
            WHERE us.Usu_Ativo = 1;`;

            const Agricultor = await db.query(sql);

            const nItens = Agricultor[0].length;

            const resultado = Agricultor[0].map(geraUrl);

            return response.status(200).json({
                sucesso: true,
                mensagem: 'Lista de Agricultores.',
                dados: resultado,
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