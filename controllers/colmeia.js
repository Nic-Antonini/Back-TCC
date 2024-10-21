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

            const sql = `INSERT INTO colmeia (Apia_Id) VALUES (?)`;

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

            const sql = `UPDATE colmeia SET Apia_Id= ? WHERE Colm_Id=?`;

            const values = [Apia_Id, Colm_Id];

            const atualizaDados = await db.query(sql, values);

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
    async ocultarColmeia(request, response) {
        try {  
            const Colmeia_Ativo = false;
            const {Colm_Id} = request.params;
            const sql = `UPDATE Colmeia SET Colmeia_Ativo = ?
                WHERE Colm_Id = ?;`;
            const values = [Colmeia_Ativo, Colm_Id];
            const atualizacao = await db.query(sql,values);
    
            return response.status(200).json({
                sucesso: true, 
                mensagem: `Colmeia ${Colm_Id} excluído com sucesso`, 
                dados: atualizacao[0].affectedRows
            });
    
        } catch (error) {
            return response.status(500).json({
                sucesso: false,
                mensagem: 'Erro na requisição.',
                dados: error.message
            });
        }
    }

}