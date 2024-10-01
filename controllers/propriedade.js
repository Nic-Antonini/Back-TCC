const db = require('../database/connection'); 

module.exports = {
    async listarPropriedade(request, response) {
        try {  
            
            const sql = `SELECT Prop_Id, Prop_Nome, Prop_Hectare, Prop_Cidade, Prop_Estado, Prop_Lat, Prop_Lng, Agri_Id from propriedade`;

            const propriedade = await db.query(sql);

           //função que executa as intruções sql (função que armazena o resultado em uma const)
           const apiarios = await db.query(sql)
            
            return response.status(200).json({
                sucesso: true, 
                mensagem: 'Lista de Propriedade.', 
                dados: propriedade[0]
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
                mensagem: 'Propriedade encontrado.',
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
    async cadastrarPropriedade(request, response) {
        try {            
            return response.status(200).json({
                sucesso: true, 
                mensagem: 'Cadastro de Propriedade.', 
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
    async editarPropriedade(request, response) {
        try {            
            return response.status(200).json({
                sucesso: true, 
                mensagem: 'editar Propriedade.', 
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
    async apagarPropriedade(request, response) {
        try {            
            return response.status(200).json({
                sucesso: true, 
                mensagem: 'Apagar Propriedade.', 
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