const db = require('../database/connection'); 

module.exports = {
    async listarEspecie(request, response) {

            const sql = `SELECT Espe_Id, Espe_Nome, Espe_Ativo FROM Especie
             WHERE Espe_Ativo = 1 ORDER BY Espe_Nome ASC;`

            const especie = await db.query(sql)

        try {            
            return response.status(200).json({
                sucesso: true, 
                mensagem: 'Lista de Especie.', 
                dados: especie[0]
            });
        } catch (error) {
            return response.status(500).json({
                sucesso: false,
                mensagem: 'Erro na Especie.',
                dados: error.message
            });
        }
    }, 

    async cadastrarEspecie(request, response) {
        try {  
            
            const {Espe_Nome } = request.body;

            const sql = `INSERT INTO Especie (Espe_Nome) VALUES (?)`;

            const values = [Espe_Nome];

            const execSql = await db.query(sql, values);

            const Espe_Id = execSql[0].insertId;

            return response.status(200).json({
                sucesso: true, 
                mensagem: 'Cadastro de Especie.', 
                dados: Espe_Id
            });
        } catch (error) {
            return response.status(500).json({
                sucesso: false,
                mensagem: 'Erro na requisição.',
                dados: error.message
            });
        }
    }, 
    async editarEspecie(request, response) {
        try { 
            
            const { Espe_Nome }= request.body;

            const {Espe_Id} = request.params;

            const sql = `UPDATE Especie SET Espe_Nome= ? WHERE Espe_Id=?`;

            const values = [Espe_Nome, Espe_Id ];

            const atualizaDados = await db.query(sql, values);

            return response.status(200).json({
                sucesso: true, 
                mensagem: 'editar Especie.', 
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
    async apagarEspecie(request, response) {
        try {   
            
            const {Espe_Id} = request.params;

            const sql = `DELETE FROM Especie WHERE Espe_Id = ?`;

            const values = [Espe_Id];

            const excluir = await db.query(sql, values);

            return response.status(200).json({
                sucesso: true, 
                mensagem: 'Apagar Especie.', 
                dados:  excluir[0].affectedRows
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