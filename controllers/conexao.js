const db = require('../database/connection'); 

module.exports = {
    async listarConexao(request, response) {
        try {  
            
            const sql = `SELECT Con_Id, Con_Salvar, Usu_Id FROM Conexao`;

            const conexao = await db.query(sql);
           

            return response.status(200).json({
                sucesso: true, 
                mensagem: 'Lista de Conexao.', 
                dados: conexao[0]
            });
        } catch (error) {
            return response.status(500).json({
                sucesso: false,
                mensagem: 'Erro na requisição.',
                dados: error.message
            });
        }
    }, 
    
    async cadastrarConexao(request, response) {
        try {   
            
            const {Con_Salvar, Usu_Id } = request.body;

            const sql = `INSERT INTO conexao (Con_Salvar, Usu_Id, Con_Id) VALUES (?, ?, ?)`;

            const values = [Con_Salvar, Usu_Id];

            const execSql = await db.query(sql, values);

            const Con_Id = execSql[0].insertId;


            return response.status(200).json({
                sucesso: true, 
                mensagem: 'Cadastro de Conexao.', 
                dados: Con_Id
            });
        } catch (error) {
            return response.status(500).json({
                sucesso: false,
                mensagem: 'Erro na requisição.',
                dados: error.message
            });
        }
    }, 
    async editarConexao(request, response) {
        try { 
            
             
            const {Usu_Id, Con_Salvar}= request.body;

            const {Con_Id} = request.params;

            const sql = `UPDATE conexao SET Usu_Id=?, Con_Salvar= ?`;

            const values = [Usu_Id, Con_Salvar, Con_Id];

            const atualizaDados = await db.query(slq, values);
            
            return response.status(200).json({
                sucesso: true, 
                mensagem: 'editar Conexao.', 
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
    async apagarConexao(request, response) {
        try {     
            
            const {Con_Id} = request.params;

            const sql = `DELETE FROM conexao WHERE Con_Salvar = ?, Usu_Id = ?`;

            const values = [Con_Id];

            const excluir = await db.query(sql, values);

            return response.status(200).json({
                sucesso: true, 
                mensagem: 'Apagar Conexao.', 
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