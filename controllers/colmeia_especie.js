const db = require('../database/connection'); 

module.exports = {
    async listarColmeiaEspecie(request, response) {

        const sql = `SELECT Colm_Espe_Id, Colm_Id, Espe_Id FROM colmeia_especie`

        const colmeia_especie = await db.query(sql)

        try {            
            return response.status(200).json({
                sucesso: true, 
                mensagem: 'Lista de Colmeia Especie.', 
                dados: colmeia_especie[0]
            });
        } catch (error) {
            return response.status(500).json({
                sucesso: false,
                mensagem: 'Erro na requisição.',
                dados: error.message
            });
        }
    }, 
    async cadastrarColmeiaEspecie(request, response) {
        try { 
            
            const {Colm_Id, Espe_Id } = request.body;

            const sql = `INSERT INTO colmeia_especie (Colm_Id, Espe_Id) VALUES (?, ?)`;

            const values = [Colm_Id, Espe_Id];

            const execSql = await db.query(sql, values);

            const Colm_Espe_Id = execSql[0].insertId;

            return response.status(200).json({
                sucesso: true, 
                mensagem: 'Cadastro de Colmeia Especie.', 
                dados: Colm_Espe_Id
            });
        } catch (error) {
            return response.status(500).json({
                sucesso: false,
                mensagem: 'Erro na requisição.',
                dados: error.message
            });
        }
    }, 

    async editarColmeiaEspecie(request, response) {
        try {  
            
            const {Colm_Id, Espe_Id}= request.body;

            const {Colm_Espe_Id} = request.params;

            const sql = `UPDATE colmeia_especie SET Colm_Id=?, Espe_Id= ? WHERE Colm_Espe_Id=? `;

            const values = [Colm_Id, Espe_Id, Colm_Espe_Id];

            const atualizaDados = await db.query(sql, values);

            return response.status(200).json({
                sucesso: true, 
                mensagem: 'editar Colmeia Especie.', 
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
    async apagarColmeiaEspecie(request, response) {
        try {   
            
            const {Colm_Espe_Id} = request.params;

            const sql = `DELETE FROM colmeia_especie WHERE Colm_Espe_Id = ?`;

            const values = [Colm_Espe_Id];

            const excluir = await db.query(sql, values);

            return response.status(200).json({
                sucesso: true, 
                mensagem: 'Apagar Colmeia Especie.', 
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