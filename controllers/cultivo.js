const db = require('../database/connection'); 

module.exports = {
    async listarCultivo(request, response) {
        try {     
            const sql = `SELECT
                Cult_Id, Cult_Nome,
                Cult_Ativo, Prop_Id
                FROM Cultivo
                WHERE Cult_Ativo = 1;`;     
                
            const Cultivo = await db.query(sql);

            const nItens = Cultivo[0].length;


            return response.status(200).json({
                sucesso: true, 
                mensagem: 'Lista de Cultivos.', 
                dados: Cultivo[0],
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




    
    async cadastrarCultivo(request, response) {
            try { 
                const {Cult_Nome, Prop_Id} = request.body;
                
                const sql = `INSERT INTO Cultivo
                    (Cult_Nome, Prop_Id)
                    VALUES (?,?)`;
                    
    
                const values = [Cult_Nome, Prop_Id]
                const execSql = await db.query(sql,values);
                const Cult_Id = execSql[0].insertId;
    
    
                return response.status(200).json({
                    sucesso: true, 
                    mensagem: 'Cadastro de Apiários.', 
                    dados: Cult_Id
                });
            } catch (error) {
                return response.status(500).json({
                    sucesso: false,
                    mensagem: 'Erro na requisição.',
                    dados: error.message
                });
            }
        }, 
        
    


    async editarCultivo(request, response) {
            try {    
                const {Cult_Nome, Cult_Ativo, Prop_Id } = request.body;
                const {Cult_Id} = request.params;
                const sql= `UPDATE Cultivo SET Cult_Nome = ?, Cult_Ativo = ?, Prop_Id = ?
                            WHERE Cult_Id = ?;`;
    
                const values = [Cult_Nome, Cult_Ativo, Prop_Id, Cult_Id];
                const atualizaDados = await db.query (sql, values);
    
            
                return response.status(200).json({
                    sucesso: true, 
                    mensagem: `Cultivo ${Cult_Id} atualizado com sucesso!`, 
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
    
    


  
    async ocultarCultivo(request, response) {
            try {  
                const Cult_Ativo = false;
                const {Cult_Id} = request.params;
                const sql = `UPDATE Cultivo SET Cult_Ativo = ?
                    WHERE Cult_Id = ?;`;
                const values = [Cult_Ativo, Cult_Id];
                const atualizacao = await db.query(sql,values);
        
                return response.status(200).json({
                    sucesso: true, 
                    mensagem: `Cultivo ${Cult_Id} excluído com sucesso`, 
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