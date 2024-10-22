const db = require('../database/connection'); 

module.exports = {
    async listarPropriedade(request, response) {
        try {     
            const sql = `SELECT
                Prop_Id, Prop_Nome, Prop_Hectare,
                Prop_Cidade, Prop_Estado, Prop_Lat,
                Prop_Lng, Agri_Id
                FROM Propriedade
                WHERE Prop_Ativo = 1;`;     
                
            const Propriedade = await db.query(sql);

            const nItens = Propriedade[0].length;


            return response.status(200).json({
                sucesso: true, 
                mensagem: 'Lista de Propriedades.', 
                dados: Propriedade[0],
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



    async listarPropriedadePorId(request, response) {
        try {
            const id = request.params.id;
            const propriedade = await db('Propriedade').where('id', id).first();
            if (!propriedade) {
                return response.status(404).json({
                    sucesso: false,
                    mensagem: 'Propriedade não encontrado.',
                    dados: null
                });
            }
            return response.status(200).json({
                sucesso: true,
                mensagem: 'Propriedade encontrada.',
                dados: propriedade
            });
        } catch (error) {
            return response.status(500).json({
                sucesso: false,
                mensagem: 'Erro na requisição.',
                dados: error.message
            });
        }
    },

    
    async cadastrarPropriedade(request, response) {
        try { 
            const {Prop_Nome, Prop_Hectare, Prop_Cidade, Prop_Estado, 
                Prop_Lat,    Prop_Lng, Agri_Id
            } = request.body;
            
            const sql = `INSERT INTO Propriedade
                (Prop_Nome, Prop_Hectare, Prop_Cidade, Prop_Estado, 
                Prop_Lat,    Prop_Lng, Agri_Id)
                VALUES (?,?,?,?,?,?,?)`;
                

            const values = [Prop_Nome, Prop_Hectare, Prop_Cidade, Prop_Estado, 
                Prop_Lat,    Prop_Lng, Agri_Id]
            const execSql = await db.query(sql,values);
            const Prop_Id = execSql[0].insertId;


            return response.status(200).json({
                sucesso: true, 
                mensagem: 'Cadastro de Propriedades.', 
                dados: Prop_Id
            });
        } catch (error) {
            return response.status(500).json({
                sucesso: false,
                mensagem: 'Erro na requisição.',
                dados: error.message
            });
        }
    }, 
    

    async editarPropriedade(request, response) {
        try {    
            const {Prop_Nome, Prop_Hectare, Prop_Cidade, Prop_Estado, 
                Prop_Lat, Prop_Lng,Prop_Ativo,  Agri_Id
            } = request.body;
            const {Prop_Id} = request.params;
            const sql= `UPDATE Propriedade SET Prop_Nome = ?,  Prop_Hectare = ?, Prop_Cidade = ?, Prop_Estado = ?,
             Prop_Lat = ?, Prop_Lng = ?,  Prop_Ativo = ?, Agri_Id = ?
                        WHERE Prop_Id = ?;`;

            const values = [Prop_Nome, Prop_Hectare, Prop_Cidade, Prop_Estado, 
                Prop_Lat, Prop_Lng,Prop_Ativo,  Agri_Id, Prop_Id];
            const atualizaDados = await db.query (sql, values);

        
            return response.status(200).json({
                sucesso: true, 
                mensagem: `Propriedade ${Prop_Id} atualizado com sucesso!`, 
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




    async ocultarPropriedade(request, response) {
        try {  
            const Prop_Ativo = false;
            const {Prop_Id} = request.params;
            const sql = `UPDATE Propriedade SET Prop_Ativo = ?
                WHERE Prop_Id = ?;`;
            const values = [Prop_Ativo, Prop_Id];
            const atualizacao = await db.query(sql,values);
    
            return response.status(200).json({
                sucesso: true, 
                mensagem: `Propriedade ${Prop_Id} excluída com sucesso`, 
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