const db = require('../database/connection'); 

module.exports = {
    async listarColmeia(request, response) {

        const sql=`select Colm_Id, Apia_Id FROM colmeia`

        const colmeia = await db.query(sql)

        try {            
            return response.status(200).json({
                sucesso: true, 
                mensagem: 'Lista de Colmeia.', 
                dados: colmeia[0]
            });
        } catch (error) {
            return response.status(500).json({
                sucesso: false,
                mensagem: 'Erro na requisição.',
                dados: error.message
            });
        }
    }, 

    async cadastrarColmeia(request, response) {
        try { 
            const {Apia_Id } = request.body;

            const sql = `INSERT INTO conexao (Apia_Id) VALUES (?)`;

            const values = [Apia_Id];

            const execSql = await db.query(sql, values);

            const Colm_Id = execSql[0].insertId;

            return response.status(200).json({
                sucesso: true, 
                mensagem: 'Cadastro de Colmeia.', 
                dados: Colm_Id
            });
        } catch (error) {
            return response.status(500).json({
                sucesso: false,
                mensagem: 'Erro na requisição.',
                dados: error.message
            });
        }
    }, 
    async editarColmeia(request, response) {
        try {    
            
            const { Apia_Id}= request.body;

            const {Colm_Id} = request.params;

            const sql = `UPDATE conexao SET Apia_Id= ?`;

            const values = [Apia_Id, Colm_Id];

            const atualizaDados = await db.query(slq, values);

            return response.status(200).json({
                sucesso: true, 
                mensagem: 'editar Colmeia.', 
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
    async apagarColmeia(request, response) {
        try {  
            
            const {Colm_Id} = request.params;

            const sql = `DELETE FROM conexao WHERE Colm_Id = ?`;

            const values = [Colm_Id];

            const excluir = await db.query(sql, values);

            return response.status(200).json({
                sucesso: true, 
                mensagem: 'Apagar Colmeia.', 
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