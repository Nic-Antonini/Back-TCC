const db = require('../database/connection'); 

module.exports = {
    async listarGaleria(request, response) {
        try {    
            
            const sql = `SELECT Gale_Id, Gale_Foto, Usu_Id FROM galeria`;

            const galeria = await db.query(sql);

            return response.status(200).json({
                sucesso: true, 
                mensagem: 'Lista de Galeria.', 
                dados: galeria[0]
            });
        } catch (error) {
            return response.status(500).json({
                sucesso: false,
                mensagem: 'Erro na requisição.',
                dados: error.message
            });
        }
    }, 
    async cadastrarGaleria(request, response) {
        try {  
            
            const {Gale_Id} = request.body;

            const sql = `INSERT INTO galeria (Gale_Id, Gale_Foto, Usu_Id) VALUES (?, ?, ?)`;

            const values = [Gale_Id];

            const execSql = await db.query(sql, values);

            const cadastrar = execSql[0]. insertId;

            return response.status(200).json({
                sucesso: true, 
                mensagem: 'Cadastro de Galeria.', 
                dados: Gale_Id
            });
        } catch (error) {
            return response.status(500).json({
                sucesso: false,
                mensagem: 'Erro na requisição.',
                dados: error.message
            });
        }
    }, 
    async editarGaleria(request, response) {
        try {            
            return response.status(200).json({
                sucesso: true, 
                mensagem: 'editar Galeria.', 
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
    async apagarGaleria(request, response) {
        try {            
            return response.status(200).json({
                sucesso: true, 
                mensagem: 'Apagar Galeria.', 
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