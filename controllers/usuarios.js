const db = require('../database/connection'); 

module.exports = {
    async listarUsuarios(request, response) {
        try {     
            const sql = `SELECT
                Usu_id, Usu_NomeCompleto, Usu_Email,
                Usu_Senha, Usu_Tipo, Usu_Ativo
                FROM Usuario
                WHERE Usu_Ativo = 1;`;     
                
            const usuarios = await db.query(sql);

            const nItens = usuarios[0].length;


            return response.status(200).json({
                sucesso: true, 
                mensagem: 'Lista de usuários.', 
                dados: usuarios[0],
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


    
    async cadastrarUsuarios(request, response) {
        try { 
            const {Usu_NomeCompleto, Usu_Email, Usu_Senha, Usu_Tipo} = request.body;
            
            const sql = `INSERT INTO Usuario
                (Usu_NomeCompleto, Usu_Email, Usu_Senha, Usu_Tipo)
                VALUES (?,?,?,?)`;
                

            const values = [Usu_NomeCompleto, Usu_Email, Usu_Senha, Usu_Tipo]
            const execSql = await db.query(sql,values);
            const Usu_Id = execSql[0].insertId;


            return response.status(200).json({
                sucesso: true, 
                mensagem: 'Cadastro de usuários.', 
                dados: Usu_Id
            });
        } catch (error) {
            return response.status(500).json({
                sucesso: false,
                mensagem: 'Erro na requisição.',
                dados: error.message
            });
        }
    }, 
    

    async editarUsuarios(request, response) {
        try {    
            const {Usu_NomeCompleto, Usu_Email, Usu_Senha, Usu_Tipo, Usu_Ativo} = request.body;
            const {Usu_Id} = request.params;
            const sql= `UPDATE Usuario SET Usu_NomeCompleto = ?,  Usu_Email = ?, Usu_Senha = ?, Usu_Tipo = ?, Usu_Ativo = ?
                        WHERE Usu_Id = ?;`;
            const values = [Usu_NomeCompleto, Usu_Email, Usu_Senha, Usu_Tipo, Usu_Ativo, Usu_Id];
            const atualizaDados = await db.query (sql, values);

        
            return response.status(200).json({
                sucesso: true, 
                mensagem: `Usuário ${Usu_Id} atualizado com sucesso!`, 
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

    
    async apagarUsuarios(request, response) {
        try {  
            const {Usu_Id} = request.params;
            const sql = `DELETE FROM Usuario WHERE Usu_Id = ?`;
            const values = [Usu_Id]     
            const excluir = await db.query (sql, values);

            return response.status(200).json({
                sucesso: true, 
                mensagem: `Usuário ${Usu_Id} excluído com sucesso`, 
                dados: excluir [0].affectedRows
            });

        } catch (error) {
            return response.status(500).json({
                sucesso: false,
                mensagem: 'Erro na requisição.',
                dados: error.message
            });
        }
    }, 


async ocultarUsuario(request, response) {
    try {  
        const Usu_Ativo = false;
        const {Usu_Id} = request.params;
        const sql = `UPDATE Usuario SET usu_ativo = ?
            WHERE usu_id = ?;`;
        const values = [Usu_Ativo, Usu_Id];
        const atualizacao = await db.query(sql,values);

        return response.status(200).json({
            sucesso: true, 
            mensagem: `Usuário ${Usu_Id} excluído com sucesso`, 
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