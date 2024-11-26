const db = require('../database/connection');

module.exports = {
    async listarCultivoPropriedade(request, response) {
        try {
            const sql = `SELECT
                p.Prop_Id, p.Prop_Nome, p.Prop_Hectare, p.Prop_Cidade, p.Prop_Estado, p.Prop_Lat, p.Prop_Lng, p.Prop_Ativo,
                GROUP_CONCAT(cp.Cult_Id) AS Cultivos
                FROM Propriedade p
            LEFT JOIN Cultivo_Propriedade cp ON p.Prop_Id = cp.Prop_Id
            WHERE p.Prop_Ativo = 1
            GROUP BY p.Prop_Id;`;

            const CultivoPropriedade = await db.query(sql);

            const nItens = CultivoPropriedade[0].length;

            return response.status(200).json({
                sucesso: true,
                mensagem: 'Lista de CultivoPropriedade.',
                dados: CultivoPropriedade[0],
                nItens,
            });
        } catch (error) {
            return response.status(500).json({
                sucesso: false,
                mensagem: 'Erro na requisição.',
                dados: error.message,
            });
        }
    },

    async cadastrarCultivoPropriedade(request, response) {
        try {
            const { Cult_Id, Prop_Id } = request.body;

            const sql = `INSERT INTO Cultivo_Propriedade
                (Cult_Id, Prop_Id)
                VALUES (?,?)`;

            const values = [Cult_Id, Prop_Id];
            const execSql = await db.query(sql, values);
            const Cult_Prop_Id = execSql[0].insertId;

            return response.status(200).json({
                sucesso: true,
                mensagem: 'Cadastro de CultivoPropriedade.',
                dados: Cult_Prop_Id,
            });
        } catch (error) {
            return response.status(500).json({
                sucesso: false,
                mensagem: 'Erro na requisição.',
                dados: error.message,
            });
        }
    },

    async editarCultivoPropriedade(request, response) {
        try {
            const { Cult_Id, Prop_Id, Cult_Prop_Ativo } = request.body;
            const { Cult_Prop_Id } = request.params;
            const sql = `UPDATE Cultivo_Propriedade SET Cult_Id = ?, Prop_Id = ?, Cult_Prop_Ativo = ?
                        WHERE Cult_Prop_Id = ?;`;

            const values = [Cult_Id, Prop_Id, Cult_Prop_Ativo, Cult_Prop_Id];
            const atualizaDados = await db.query(sql, values);

            return response.status(200).json({
                sucesso: true,
                mensagem: `CultivoPropriedade ${Cult_Prop_Id} atualizado com sucesso!`,
                dados: atualizaDados[0].affectedRows,
            });
        } catch (error) {
            return response.status(500).json({
                sucesso: false,
                mensagem: 'Erro na requisição.',
                dados: error.message,
            });
        }
    },

    async ocultarCultivoPropriedade(request, response) {
        try {
            const Cult_Prop_Ativo = false;
            const { Cult_Prop_Id } = request.params;
            const sql = `UPDATE Cultivo_Propriedade SET Cult_Prop_Ativo = ?
                WHERE Cult_Prop_Id = ?;`;
            const values = [Cult_Prop_Ativo, Cult_Prop_Id];
            const atualizacao = await db.query(sql, values);

            return response.status(200).json({
                sucesso: true,
                mensagem: `CultivoPropriedade ${Cult_Prop_Id} excluído com sucesso`,
                dados: atualizacao[0].affectedRows,
            });
        } catch (error) {
            return response.status(500).json({
                sucesso: false,
                mensagem: 'Erro na requisição.',
                dados: error.message,
            });
        }
    },
};
