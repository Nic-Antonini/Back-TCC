const db = require('../database/connection'); 

module.exports = {
    async verificarConexao(req, res) {
        try {
            const { Usu_Id_segue, Usu_Id_seguindo } = req.query;
    
            const sql = `
                SELECT Con_Id 
                FROM Conexao 
                WHERE Usu_Id_segue = ? AND Usu_Id_seguindo = ?
            `;
            const [result] = await db.query(sql, [Usu_Id_segue, Usu_Id_seguindo]);
    
            if (result.length === 0) {
                return res.status(200).json({ sucesso: true, dados: null });
            }
    
            res.status(200).json({ sucesso: true, dados: result[0] });
        } catch (error) {
            res.status(500).json({ sucesso: false, mensagem: "Erro ao buscar conexão.", dados: error.message });
        }
      },
    
      async cadastrarConexao(req, res) {
        try {
          const { Usu_Id_segue, Usu_Id_seguindo } = req.body;
          const sql = `INSERT INTO Conexao (Usu_Id_segue, Usu_Id_seguindo) VALUES (?, ?)`;
          const [result] = await db.query(sql, [Usu_Id_segue, Usu_Id_seguindo]);
          res.status(200).json({ sucesso: true, dados: result.insertId });
        } catch (error) {
          res.status(500).json({ sucesso: false, mensagem: "Erro ao cadastrar conexão.", dados: error.message });
        }
      },
    
      async apagarConexao(req, res) {
        try {
          const { Con_Id } = req.params;
          const sql = `DELETE FROM Conexao WHERE Con_Id = ?`;
          const [result] = await db.query(sql, [Con_Id]);
          res.status(200).json({ sucesso: true, dados: result.affectedRows });
        } catch (error) {
          res.status(500).json({ sucesso: false, mensagem: "Erro ao apagar conexão.", dados: error.message });
        }
      },
    }