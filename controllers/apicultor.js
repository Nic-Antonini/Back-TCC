const db = require('../database/connection');

module.exports = {
    async listarApicultor(request, response) {
        try {
            const sql = `SELECT
            ap.Apic_Id, us.Usu_NomeCompleto, ap.Apic_Foto_Perfil, ap.Apic_Foto_Capa,
            ap.Apic_Biografia, ap.Usu_Id
            FROM Apicultor ap 
            INNER JOIN usuario us ON us.Usu_Id = ap.Usu_Id 
            WHERE us.Usu_Ativo = 1;`;

            const Apicultor = await db.query(sql);

            const nItens = Apicultor[0].length;


            return response.status(200).json({
                sucesso: true,
                mensagem: 'Lista de Apicultores.',
                dados: Apicultor[0],
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


    async listarApicultorPorId(request, response) {
        try {
            const id = request.params.id;
            const Apicultor = await db('Apicultor').where('id', id).first();
            if (!Apicultor) {
                return response.status(404).json({
                    sucesso: false,
                    mensagem: 'Apicultor não encontrado.',
                    dados: null
                });
            }
            return response.status(200).json({
                sucesso: true,
                mensagem: 'Apicultor encontrado.',
                dados: Apicultor
            });
        } catch (error) {
            return response.status(500).json({
                sucesso: false,
                mensagem: 'Erro na requisição.',
                dados: error.message
            });
        }
    },


    async cadastrarApicultor(request, response) {
        try {

            const {Usu_NomeCompleto, Usu_Email, Usu_Senha, Usu_Tipo, Apic_Foto_Perfil, Apic_Foto_Capa, Apic_Biografia} = request.body;
            
            const sql = `INSERT INTO Usuario
                (Usu_NomeCompleto, Usu_Email, Usu_Senha, Usu_Tipo)
                VALUES (?,?,?,?)`;
                

            const values = [Usu_NomeCompleto, Usu_Email, Usu_Senha, Usu_Tipo]
            const execSql = await db.query(sql,values);
            const Usu_Id = execSql[0].insertId;            

            const sql2 = `INSERT INTO Apicultor
                (Apic_Foto_Perfil, Apic_Foto_Capa, Apic_Biografia, Usu_Id)
                VALUES (?,?,?,?)`;


            const values2 = [Apic_Foto_Perfil, Apic_Foto_Capa, Apic_Biografia, Usu_Id]
            const execSql2 = await db.query(sql2, values2);
            const Apic_Id = execSql2[0].insertId;


            return response.status(200).json({
                sucesso: true,
                mensagem: 'Cadastro de Apicultores.',
                dados: Apic_Id
            });

        } catch (error) {
            return response.status(500).json({
                sucesso: false,
                mensagem: 'Erro na requisição.',
                dados: error.message
            });
        }
    },



    async editarApicultor(request, response) {
        try {
            const { Apic_Foto_Perfil, Apic_Foto_Capa, Apic_Biografia, Usu_Id } = request.body;
            const { Apic_Id } = request.params;
            const sql = `UPDATE Apicultor SET Apic_Foto_Perfil = ?,  Apic_Foto_Capa = ?, Apic_Biografia = ?, Usu_Id = ?
                        WHERE Apic_Id = ?;`;
            const values = [Apic_Foto_Perfil, Apic_Foto_Capa, Apic_Biografia, Usu_Id, Apic_Id];
            const atualizaDados = await db.query(sql, values);


            return response.status(200).json({
                sucesso: true,
                mensagem: `Apicultor ${Apic_Id} atualizado com sucesso!`,
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



    async apagarApicultor(request, response) {
        try {
            const { Usu_Id } = request.params;
            const sql = `UPDATE Usuario    Usu
                        INNER JOIN Apicultor Apic ON Usu.Usu_Id = Apic.Usu_id
                        SET Usu.Usu_Ativo = 0 
                        WHERE Apic.Apic_Id = ?;`;

            const values = [Usu_Id]
            const excluir = await db.query(sql, values);

            return response.status(200).json({
                sucesso: true,
                mensagem: `Apicultor ${Usu_Id} excluído com sucesso`,
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