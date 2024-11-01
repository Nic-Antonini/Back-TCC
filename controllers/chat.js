const db = require('../database/connection'); 

module.exports = {
    async listarChat(request, response) {
        try {     
            const sql = `SELECT
                Chat_Id, Chat_Mensagem, Chat_Midia,
                Chat_Dta_Hora, Chat_Visto, Chat_Ativo,
                Apic_Id, Agri_Id
                FROM Chat
                WHERE Chat_Ativo = 1;`;     
                
            const Chat = await db.query(sql);

            const nItens = Chat[0].length;


            return response.status(200).json({
                sucesso: true, 
                mensagem: 'Lista de Chats.', 
                dados: Chat[0],
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


    
    async cadastrarChat(request, response) {
        try { 
            const {Chat_Id, Chat_Mensagem, Chat_Midia,
                Chat_Dta_Hora, Chat_Visto,
                Apic_Id, Agri_Id} = request.body;
            
            const sql = `INSERT INTO Chat
                (Chat_Id, Chat_Mensagem, Chat_Midia,
                Chat_Dta_Hora, Chat_Visto,
                Apic_Id, Agri_Id)
                VALUES (?,?,?,?,?,?,?)`;
                

            const values = [Chat_Id, Chat_Mensagem, Chat_Midia,
                Chat_Dta_Hora, Chat_Visto,
                Apic_Id, Agri_Id]
            const execSql = await db.query(sql,values);
            const Chat_id = execSql[0].insertId;


            return response.status(200).json({
                sucesso: true, 
                mensagem: 'Cadastro de Chat.', 
                dados: Chat_id
            });
        } catch (error) {
            return response.status(500).json({
                sucesso: false,
                mensagem: 'Erro na requisição.',
                dados: error.message
            });
        }
    }, 
    


    async editarChat(request, response) {
        try {    
            const {Chat_Mensagem, Chat_Midia,
                Chat_Dta_Hora, Chat_Visto, Chat_Ativo,
                Apic_Id, Agri_Id
            } = request.body;
            const {Chat_Id} = request.params;
            const sql= `UPDATE Chat SET Chat_Mensagem = ?,  Chat_Midia = ?, Chat_Dta_Hora = ?, Chat_Visto = ?,
             Chat_Ativo = ?, Apic_Id = ?,  Agri_Id = ?
                        WHERE Chat_Id = ?;`;

            const values = [Chat_Mensagem, Chat_Midia,
                Chat_Dta_Hora, Chat_Visto, Chat_Ativo,
                Apic_Id, Agri_Id, Chat_Id];
            const atualizaDados = await db.query (sql, values);

        
            return response.status(200).json({
                sucesso: true, 
                mensagem: `Chat ${Chat_Id} atualizado com sucesso!`, 
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




    async ocultarChat(request, response) {
        try {  
            const Chat_Ativo = false;
            const {Chat_Id} = request.params;
            const sql = `UPDATE Chat SET Chat_Ativo = ?
                WHERE Chat_Id = ?;`;
            const values = [Chat_Ativo, Chat_Id];
            const atualizacao = await db.query(sql,values);
    
            return response.status(200).json({
                sucesso: true, 
                mensagem: `Chat ${Chat_Id} excluído com sucesso`, 
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
  