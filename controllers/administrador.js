const db = require('../database/connection');

module.exports = {
    async listarAdministrador(request, response) {
        try {
            const sql = `SELECT
            Ad.Adm_Id, us.Usu_NomeCompleto
            FROM Administrador ad 
            INNER JOIN usuario us ON us.Usu_Id = Ad.Adm_Id 
            WHERE us.Usu_Ativo = 1;`;

            const Administrador = await db.query(sql);

            const nItens = Administrador[0].length;


            return response.status(200).json({
                sucesso: true,
                mensagem: 'Lista de Administradores.',
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


    async listarAdministradorPorId(request, response) {
        try {
            const id = request.params.id;
            const Administrador = await db('Administrador').where('id', id).first();
            if (!Administrador) {
                return response.status(404).json({
                    sucesso: false,
                    mensagem: 'Administrador não encontrado.',
                    dados: null
                });
            }
            return response.status(200).json({
                sucesso: true,
                mensagem: 'Administrador encontrado.',
                dados: Administrador
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
            const Usu_Id = execSql[0].insertId;            

            const sql2 = `INSERT INTO Administrador
                (Adm_Id)
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