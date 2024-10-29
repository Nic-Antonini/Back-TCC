const db = require('../database/connection');

module.exports = {
    async listarAdministrador(request, response) {
            try {
                const sql = `SELECT
                adm.Adm_Id, us.Usu_NomeCompleto, adm.Usu_Id
                FROM Administrador adm 
                INNER JOIN usuario us ON us.Usu_Id = adm.Usu_Id 
                WHERE us.Usu_Ativo = 1;`;
    
                const Administrador = await db.query(sql);
    
                const nItens = Administrador[0].length;
    
    
                return response.status(200).json({
                    sucesso: true,
                    mensagem: 'Lista de Administrador.',
                    dados: Administrador[0],
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



    async cadastrarAdministrador(request, response) {
        try {

            const {Usu_NomeCompleto, Usu_Email, Usu_Senha, Usu_Tipo} = request.body;
            
            const sql = `INSERT INTO Usuario
                (Usu_NomeCompleto, Usu_Email, Usu_Senha, Usu_Tipo)
                VALUES (?,?,?,?)`;
                

            const values = [Usu_NomeCompleto, Usu_Email, Usu_Senha, Usu_Tipo]
            const execSql = await db.query(sql,values);
            const Usu_id = execSql[0].insertId;            

            const sql2 = `INSERT INTO Administrador
                (Usu_Id)
                VALUES (?)`;


            const values2 = [Usu_Id]
            const execSql2 = await db.query(sql2, values2);
            const Adm_Id = execSql2[0].insertId;


            return response.status(200).json({
                sucesso: true,
                mensagem: 'Cadastro de Administradores.',
                dados: Adm_Id
            });

        } catch (error) {
            return response.status(500).json({
                sucesso: false,
                mensagem: 'Erro na requisição.',
                dados: error.message
            });
        }
    },



    //CORRIGIR EDITAR E APAGAR ADMINISTRADOR!!!!!

    async editarAdministrador(request, response) {
        try {
            const { Usu_Id } = request.body;
            const { Adm_Id } = request.params;
            const sql = `UPDATE Usuario SET _Id = ?
                        WHERE Usu_Id = ?;`;
            const values = [Adm_Id];
            const atualizaDados = await db.query(sql, values);


            return response.status(200).json({
                sucesso: true,
                mensagem: `Administrador ${Adm_Id} atualizado com sucesso!`,
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





    async apagarAdministrador(request, response) {
        try {
            const { Usu_Id } = request.params;
            const sql = `UPDATE Usuario    Usu
                      INNER JOIN usuario us ON us.Usu_Id = Ad.Adm_Id 
            WHERE Adm_Id- ?;`;


            const values = [Usu_Id]
            const excluir = await db.query(sql, values);

            return response.status(200).json({
                sucesso: true,
                mensagem: `Administrador ${Usu_Id} excluído com sucesso`,
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
 
};  