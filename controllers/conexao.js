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
            return response.status(200).json({
                sucesso: true, 
                mensagem: 'editar Conexao.', 
                dados: null
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
            return response.status(200).json({
                sucesso: true, 
                mensagem: 'Apagar Conexao.', 
                dados: null
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