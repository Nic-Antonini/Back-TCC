const db = require('../database/connection');
var fs = require('fs-extra');

function geraUrl(e) {
    // garantir que valores em branco carreguem algo
    let img = e.Apic_Foto_Perfil ? e.Apic_Foto_Perfil : 'beekeeper.png';
    // verifica se imagem existe
    if (!fs.existsSync('./public/upload/profileImage/' + img)) {
        img = 'beekeeper.jpg';
    }

    let imgCover = e.Apic_Foto_Capa ? e.Apic_Foto_Capa : 'default-cover.png';
    if (!fs.existsSync('./public/upload/profileCover/' + imgCover)) {
        imgCover = 'default-cover.png';
    }  

    const Apicultor = {
        Apic_Id: e.Apic_Id,
        Apic_Foto_Perfil: 'http://192.168.0.17:3333/public/upload/profileImage/' + img,
        Apic_Foto_Capa: 'http://192.168.0.17:3333/public/upload/profileCover/' + imgCover,
        Apic_Biografia: e.Apic_Biografia,
        Usu_Id: e.Usu_Id
    };

    return Apicultor;
}

module.exports = {
    async listarApicultor(request, response) {
        try {
            const sql = `SELECT
            ap.Apic_Id, us.Usu_NomeCompleto, ap.Apic_Foto_Perfil, ap.Apic_Foto_Capa,
            ap.Apic_Biografia, ap.Usu_Id
            FROM Apicultor ap 
            INNER JOIN usuario us ON us.Usu_Id = ap.Usu_Id 
            WHERE us.Usu_Ativo = 1;`;

            const Apicultor = await db.query(sql);

            const nItens = Apicultor[0].length;
        
            const resultado = Apicultor[0].map(geraUrl)

            return response.status(200).json({
                sucesso: true,
                mensagem: 'Lista de Apicultores.',
                dados: resultado,
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




    async cadastrarApicultor(request, response) {
        try {

            const {Usu_NomeCompleto, Usu_Email, Usu_Senha, Usu_Tipo, Apic_Foto_Perfil, Apic_Foto_Capa, Apic_Biografia} = request.body;
            
            const sql = `INSERT INTO Usuario
                (Usu_NomeCompleto, Usu_Email, Usu_Senha, Usu_Tipo)
                VALUES (?,?,?,?)`;
                

            const values = [Usu_NomeCompleto, Usu_Email, Usu_Senha, Usu_Tipo]
            const execSql = await db.query(sql,values);
            const Usu_Id = execSql[0].insertId;            

            const sql2 = `INSERT INTO Apicultor
                (Apic_Foto_Perfil, Apic_Foto_Capa, Apic_Biografia, Usu_Id)
                VALUES (?,?,?,?)`;


            const values2 = [Apic_Foto_Perfil, Apic_Foto_Capa, Apic_Biografia, Usu_Id]
            const execSql2 = await db.query(sql2, values2);
            const Apic_Id = execSql2[0].insertId;


            return response.status(200).json({
                sucesso: true,
                mensagem: 'Cadastro de Apicultores.',
                dados: Apic_Id
            });

        } catch (error) {
            return response.status(500).json({
                sucesso: false,
                mensagem: 'Erro na requisição.',
                dados: error.message
            });
        }
    },



    async editarApicultor(request, response) {
        try {
            const { Apic_Foto_Perfil, Apic_Foto_Capa, Apic_Biografia, Usu_Id } = request.body;
            const { Apic_Id } = request.params;
            const sql = `UPDATE Apicultor SET Apic_Foto_Perfil = ?,  Apic_Foto_Capa = ?, Apic_Biografia = ?, Usu_Id = ?
                        WHERE Apic_Id = ?;`;
            const values = [Apic_Foto_Perfil, Apic_Foto_Capa, Apic_Biografia, Usu_Id, Apic_Id];
            const atualizaDados = await db.query(sql, values);


            return response.status(200).json({
                sucesso: true,
                mensagem: `Apicultor ${Apic_Id} atualizado com sucesso!`,
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



    async apagarApicultor(request, response) {
        try {
            const { Usu_Id } = request.params;
            const sql = `UPDATE Usuario    Usu
                        INNER JOIN Apicultor Apic ON Usu.Usu_Id = Apic.Usu_id
                        SET Usu.Usu_Ativo = 0 
                        WHERE Apic.Apic_Id = ?;`;

            const values = [Usu_Id]
            const excluir = await db.query(sql, values);

            return response.status(200).json({
                sucesso: true,
                mensagem: `Apicultor ${Usu_Id} excluído com sucesso`,
                dados: excluir[0].affectedRows
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