const db = require('../database/connection'); 

module.exports = {
    async listarColmeiaEspecie(request, response) {
        try {            
            return response.status(200).json({
                sucesso: true, 
                mensagem: 'Lista de Colmeia Especie.', 
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
    async cadastrarColmeiaEspecie(request, response) {
        try {            
            return response.status(200).json({
                sucesso: true, 
                mensagem: 'Cadastro de Colmeia Especie.', 
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
    async listarColmeiaEspeciePorId(request, response) {
        try {
            const id = request.params.id;
            const colmeiaEspecie = await db('Colmeia_Especie').where('id', id).first();
            if (!colmeiaEspecie) {
                return response.status(404).json({
                    sucesso: false,
                    mensagem: 'Colmeia Especie não encontrado.',
                    dados: null
                });
            }
            return response.status(200).json({
                sucesso: true,
                mensagem: 'Colmeia Especie encontrado.',
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
    async editarColmeiaEspecie(request, response) {
        try {            
            return response.status(200).json({
                sucesso: true, 
                mensagem: 'editar Colmeia Especie.', 
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
    async apagarColmeiaEspecie(request, response) {
        try {            
            return response.status(200).json({
                sucesso: true, 
                mensagem: 'Apagar Colmeia Especie.', 
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