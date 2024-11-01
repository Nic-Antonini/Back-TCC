const db = require('../database/connection'); 

module.exports = {
    async listarApiarios(request, response) {
        try {     
            const sql = `SELECT
                Apia_Id, Apia_Nome, Apia_Cidade,
                Apia_Estado, Apia_Lat, Apia_Lng,
                Apia_Caixas, Apia_Ativo, Apic_Id
                FROM Apiarios
                WHERE Apia_Ativo = 1;`;     
                
            const Apiarios = await db.query(sql);

            const nItens = Apiarios[0].length;


            return response.status(200).json({
                sucesso: true, 
                mensagem: 'Lista de Apiarios.', 
                dados: Apiarios[0],
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


    
    async cadastrarApiarios(request, response) {
        try { 
            const {Apia_Nome, Apia_Cidade, Apia_Estado, Apia_Lat, 
                Apia_Lng,   Apia_Caixas, Apic_Id
            } = request.body;
            
            const sql = `INSERT INTO Apiarios
                (Apia_Nome, Apia_Cidade, Apia_Estado, Apia_Lat, 
                Apia_Lng,    Apia_Caixas, Apic_Id)
                VALUES (?,?,?,?,?,?,?)`;
                

            const values = [Apia_Nome, Apia_Cidade, Apia_Estado, Apia_Lat, 
                Apia_Lng,    Apia_Caixas, Apic_Id]
            const execSql = await db.query(sql,values);
            const Apia_Id = execSql[0].insertId;


            return response.status(200).json({
                sucesso: true, 
                mensagem: 'Cadastro de Apiários.', 
                dados: Apia_Id
            });
        } catch (error) {
            return response.status(500).json({
                sucesso: false,
                mensagem: 'Erro na requisição.',
                dados: error.message
            });
        }
    }, 
    

    async editarApiarios(request, response) {
        try {    
            const {Apia_Nome, Apia_Cidade, Apia_Estado, Apia_Lat, Apia_Lng,
                Apia_Caixas, Apia_Ativo, Apic_Id
            } = request.body;
            const {Apia_Id} = request.params;
            const sql= `UPDATE Apiarios SET Apia_Nome = ?,  Apia_Cidade = ?, Apia_Estado = ?, Apia_Lat = ?,
             Apia_Lng = ?, Apia_Caixas = ?,  Apia_Ativo = ?, Apic_Id = ?
                        WHERE Apia_Id = ?;`;

            const values = [Apia_Nome, Apia_Cidade, Apia_Estado, Apia_Lat, Apia_Lng,
                Apia_Caixas, Apia_Ativo, Apic_Id, Apia_Id];
            const atualizaDados = await db.query (sql, values);

        
            return response.status(200).json({
                sucesso: true, 
                mensagem: `Apiários ${Apia_Id} atualizado com sucesso!`, 
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




    async ocultarApiarios(request, response) {
        try {  
            const Apia_Ativo = false;
            const {Apia_Id} = request.params;
            const sql = `UPDATE Apiarios SET Apia_Ativo = ?
                WHERE Apia_Id = ?;`;
            const values = [Apia_Ativo, Apia_Id];
            const atualizacao = await db.query(sql,values);
    
            return response.status(200).json({
                sucesso: true, 
                mensagem: `Apiário ${Apia_Id} excluído com sucesso`, 
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