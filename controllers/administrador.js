const db = require('../database/connection'); 

module.exports = {
    async listarAdministradores(request, response) {
        try {
            
            const sql = `SELECT Adm_Id FROM Administrador`;

            const  administrador = await db.query(sql);

            return response.status(200).json({
                sucesso: true, 
                mensagem: 'Lista de admnistrador.', 
                dados: administrador[0]
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
            
            const {adm_Id} = request.body;

            const sql = `INSERT INTO administrador (Adm_Id) VALUES (?)`;

            const values = [adm_Id];

            const execSql = await db.query(sql, values);

            const cadastrar = execSql[0]. insertId;

            return response.status(200).json({
                sucesso: true, 
                mensagem: 'Cadastro de Administrador.', 
                dados: adm_Id
            });
        } catch (error) {
            return response.status(500).json({
                sucesso: false,
                mensagem: 'Erro na requisição.',
                dados: error.message
            });
        }
    }, 
   
    async editarAdministrador(request, response) {
        try {  
            
            const {adm_Id} = request.body;

            const {Adm_Id} = request.params;

            const sql = `UPDATE administrador SET Adm_Id = ? WHERE Adm_Id =?`;

            const values = [adm_Id, Adm_Id];

            const atualizaDados = await db.query(sql, values);

            return response.status(200).json({
                sucesso: true, 
                mensagem: 'editar Administrador.', 
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
            
            const {Adm_Id} = request.params;

            const sql = `DELETE FROM administrador WHERE Adm_Id = ?`;

            const values = [Adm_Id];

            const excluir = await db.query(sql, values);


            return response.status(200).json({
                sucesso: true, 
                mensagem: 'Apagar Administrador.', 
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