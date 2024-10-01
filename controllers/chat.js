const db = require('../database/connection'); 

module.exports = {
    async listarChats(request, response) {
        try { 
            
            const sql = `SELECT Chat_Id, Chat_Mensagem, Chat_Midia, Chat_Dta_Hora,
            Chat_Visto, Apic_Id, Agri_Id FROM chat`

            const chat = await db.query(sql)

            return response.status(200).json({
                sucesso: true, 
                mensagem: 'Lista de Chats.', 
                dados: chat[0]
            });
        } catch (error) {
            return response.status(500).json({
                sucesso: false,
                mensagem: 'Erro na requisição.',
                dados: error.message
            });
        }
    },
    async listarChatsPorId(request, response) {
        try {
            const id = request.params.id;
            const chats = await db('chat').where('Chat_Id', id).first();
            if (!chats) {
                return response.status(404).json({
                    sucesso: false,
                    mensagem: 'Chats não encontrado.',
                    dados: null
                });
            }
            return response.status(200).json({
                sucesso: true,
                mensagem: 'Chats encontrado.',
                dados: chats
            });
        } catch (error) {
            return response.status(500).json({
                sucesso: false,
                mensagem: 'Erro na requisição.',
                dados: error.message
            });
        }
    },
    async cadastrarChats(request, response) {
        try {            
            return response.status(200).json({
                sucesso: true, 
                mensagem: 'Cadastro de Chats.', 
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
    async editarChats(request, response) {
        try {            
            return response.status(200).json({
                sucesso: true, 
                mensagem: 'editar Chats.', 
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
    async apagarChats(request, response) {
        try {            
            return response.status(200).json({
                sucesso: true, 
                mensagem: 'Apagar Chats.', 
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