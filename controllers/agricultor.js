const db = require('../database/connection');
const fs = require('fs-extra');


    function geraUrl(e) {
        const img = e.Agri_Foto_Perfil ? e.Agri_Foto_Perfil : 'farmer.png'; 
        const imgCover = e.Agri_Foto_Capa ? e.Agri_Foto_Capa : 'default-cover.png';
    
        const Agricultor = {
            Agri: e.Agri_Id,
            Agri_Foto_Perfil: `${process.env.NEXT_PUBLIC_BASE_URL}/public/upload/profileImage/${img}`,
            Agri_Foto_Capa: `${process.env.NEXT_PUBLIC_BASE_URL}/upload/profileCover/${imgCover}`,
            Agri_Biografia: e.Agri_Biografia,
            Usu_Id: e.Usu_Id
        };
    
        return Agricultor;
    }
    


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
            const { Agri_Biografia } = request.body;
            const { Agri_Id } = request.params;
    
            let Agri_Foto_Perfil = request.file ? request.file.filename : null;  // Arquivo de imagem de perfil
            let Agri_Foto_Capa = request.files ? request.files.coverImage[0].filename : null; // Arquivo de capa
    
            if (!Agri_Foto_Perfil && !Agri_Foto_Capa) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'Por favor, envie uma imagem de perfil ou de capa.'
                });
            }
    
            // Atualiza o Agricultor com as novas informações (se houver)
            const sql = `UPDATE Agricultor SET Agri_Foto_Perfil = ?, Agri_Foto_Capa = ?, Agri_Biografia = ? WHERE Agri_Id = ?;`;
            const values = [Agri_Foto_Perfil, Agri_Foto_Capa, Agri_Biografia, Agri_Id];
    
            await db.query(sql, values);
    
            return response.status(200).json({
                sucesso: true,
                mensagem: `Agricultor ${Agri_Id} atualizado com sucesso!`
            });
    
        } catch (error) {
            return response.status(500).json({
                sucesso: false,
                mensagem: 'Erro na requisição.',
                dados: error.message
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