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
                mensagem: 'Lista de Apiários.', 
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

    async listarApiarioPorId(request, response) {
        try {
            const id = request.params.id;
            const apiarios = await db('Apiario').where('id', id).first();
            if (!apiarios) {
                return response.status(404).json({
                    sucesso: false,
                    mensagem: 'Apiário não encontrado.',
                    dados: null
                });
            }
            return response.status(200).json({
                sucesso: true,
                mensagem: 'Apiário encontrado.',
                dados: apiarios
            });
        } catch (error) {
            return response.status(500).json({
                sucesso: false,
                mensagem: 'Erro na requisição.',
                dados: error.message
            });
        }
    },


}