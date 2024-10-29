const db = require('../database/connection'); 

module.exports = {
    async listarConexao(request, response) {
        try {     
            const sql = `SELECT
                Con_Id, Usu_Id_segue, Usu_Id_seguindo
                FROM Conexao;`;     
                
            const conexao = await db.query(sql);

            const nItens = conexao[0].length;


            return response.status(200).json({
                sucesso: true, 
                mensagem: 'Lista de Conexão.', 
                dados: conexao[0],
                nItens
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
                const {Usu_Id_segue, Usu_Id_seguindo} = request.body;
                
                const sql = `INSERT INTO Conexao
                    (Usu_Id_segue, Usu_Id_seguindo)
                    VALUES (?,?)`;
                    
    
                const values = [Usu_Id_segue, Usu_Id_seguindo]
                const execSql = await db.query(sql,values);
                const Con_Id = execSql[0].insertId;
    
    
                return response.status(200).json({
                    sucesso: true, 
                    mensagem: 'Cadastro de Conexão.', 
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
            const {Usu_Id_segue, Usu_Id_seguindo} = request.body;
            const {Con_Id} = request.params;
            const sql= `UPDATE Conexao SET Usu_Id_segue = ?,  Usu_Id_seguindo = ?
                        WHERE Con_Id = ?;`;
            const values = [Usu_Id_segue, Usu_Id_seguindo, Con_Id];
            const atualizaDados = await db.query (sql, values);

        
            return response.status(200).json({
                sucesso: true, 
                mensagem: `Conexão ${Con_Id} atualizado com sucesso!`, 
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
            const sql = `DELETE FROM Conexao WHERE Con_Id = ?`;
            const values = [Con_Id]     
            const excluir = await db.query (sql, values);

            return response.status(200).json({
                sucesso: true, 
                mensagem: `Conexão ${Con_Id} excluído com sucesso`, 
                dados: excluir [0].affectedRows
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