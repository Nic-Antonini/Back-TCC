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
            
            const {Usu_Id, Gale_Foto} = request.body;

            const sql = `INSERT INTO galeria (Usu_Id, Gale_Foto) VALUES (?, ?)`;

            const values = [Usu_Id, Gale_Foto ];

            const execSql = await db.query(sql, values);

            const Gale_Id = execSql[0].insertId;

            return response.status(200).json({
                sucesso: true, 
                mensagem: 'Cadastro de Galeria.', 
                dados:Gale_Id
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
            
            const {Usu_Id, Gale_Foto}= request.body;

            const {Gale_Id} = request.params;

            const sql = `UPDATE galeria SET Usu_Id=?, Gale_Foto= ? WHERE Gale_Id = ?`;

            const values = [Usu_Id, Gale_Foto, Gale_Id];

            const atualizaDados = await db.query(sql, values);
            

            return response.status(200).json({
                sucesso: true, 
                mensagem: 'editar Galeria.', 
                dados:atualizaDados[0].affectedRows
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
            
            const {Gale_Id} = request.params;

            const sql = `DELETE FROM galeria WHERE Gale_Id = ?`;

            const values = [Gale_Id];

            const excluir = await db.query(sql, values);


            return response.status(200).json({
                sucesso: true, 
                mensagem: 'Apagar Galeria.', 
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