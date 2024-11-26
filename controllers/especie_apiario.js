const db = require('../database/connection');

module.exports = {
    async listarEspecieApiario(request, response) {
        try {
            const sql = `SELECT
                a.Apia_Id, a.Apia_Nome, a.Apia_Cidade, a.Apia_Estado, a.Apia_Lat, a.Apia_Lng, a.Apia_Caixas, a.Apia_Ativo,
                GROUP_CONCAT(ea.Espe_Id) AS Especies
                FROM Apiarios a
            LEFT JOIN Especie_Apiario ea ON a.Apia_Id = ea.Apia_Id
            WHERE a.Apia_Ativo = 1
            GROUP BY a.Apia_Id;`;

            const EspecieApiario = await db.query(sql);

            const nItens = EspecieApiario[0].length;

            return response.status(200).json({
                sucesso: true,
                mensagem: 'Lista de EspecieApiario.',
                dados: EspecieApiario[0],
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

    async cadastrarEspecieApiario(request, response) {
        try {
            const { Apia_Id, Espe_Id } = request.body;

            const sql = `INSERT INTO Especie_Apiario
                (Apia_Id, Espe_Id)
                VALUES (?,?)`;

            const values = [Apia_Id, Espe_Id];
            const execSql = await db.query(sql, values);
            const Espe_Apia_Id = execSql[0].insertId;

            return response.status(200).json({
                sucesso: true,
                mensagem: 'Cadastro de Especie Apiario.',
                dados: Espe_Apia_Id,
            });
        } catch (error) {
            return response.status(500).json({
                sucesso: false,
                mensagem: 'Erro na requisição.',
                dados: error.message,
            });
        }
    },

    async editarEspecieApiario(request, response) {
        try {
            const { Apia_Id, Espe_Id, Espe_Apia_Ativo } = request.body;
            const { Espe_Apia_Id } = request.params;
            const sql = `UPDATE Especie_Apiario SET Apia_Id = ?, Espe_Id = ?, Espe_Apia_Ativo = ?
                        WHERE Espe_Apia_Id = ?;`;

            const values = [Apia_Id, Espe_Id, Espe_Apia_Ativo, Espe_Apia_Id];
            const atualizaDados = await db.query(sql, values);

            return response.status(200).json({
                sucesso: true,
                mensagem: `Especie Apiario ${Espe_Apia_Id} atualizado com sucesso!`,
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

    async ocultarEspecieApiario(request, response) {
        try {
            const Espe_Apia_Ativo = false;
            const { Espe_Apia_Id } = request.params;
            const sql = `UPDATE Especie_Apiario SET Espe_Apia_Ativo = ?
                WHERE Espe_Apia_Id = ?;`;
            const values = [Espe_Apia_Ativo, Espe_Apia_Id];
            const atualizacao = await db.query(sql, values);

            return response.status(200).json({
                sucesso: true,
                mensagem: `Especie Apiario ${Espe_Apia_Id} excluído com sucesso`,
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
