const db = require('../database/connection'); 

module.exports = {
    async listarCultivoPropriedade(request, response) {
        try {            
            return response.status(200).json({
                sucesso: true, 
                mensagem: 'Lista de Cultivo Propriedade.', 
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
    async listarCultivoPropriedadePorId(request, response) {
        try {
            const id = request.params.id;
            const cultivoPropriedade = await db('Cultivo_Propriedade').where('id', id).first();
            if (!cultivoPropriedade) {
                return response.status(404).json({
                    sucesso: false,
                    mensagem: 'Cultivo Propriedade não encontrado.',
                    dados: null
                });
            }
            return response.status(200).json({
                sucesso: true,
                mensagem: 'Cultivo Propriedade encontrado.',
                dados: agricultor
            });
        } catch (error) {
            return response.status(500).json({
                sucesso: false,
                mensagem: 'Erro na requisição.',
                dados: error.message
            });
        }
    },
    async cadastrarCultivoPropriedade(request, response) {
        try {            
            return response.status(200).json({
                sucesso: true, 
                mensagem: 'Cadastro de Cultivo Propriedade.', 
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
    async editarCultivoPropriedade(request, response) {
        try {            
            return response.status(200).json({
                sucesso: true, 
                mensagem: 'editar Cultivo Propriedade.', 
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
    async apagarCultivoPropriedade(request, response) {
        try {            
            return response.status(200).json({
                sucesso: true, 
                mensagem: 'Apagar Cultivo Propriedade.', 
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