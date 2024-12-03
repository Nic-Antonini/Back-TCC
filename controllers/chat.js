const db = require('../database/connection'); 

require("dotenv").config();
var fs = require("fs-extra");

const API_URL = process.env.API_URL;
function geraUrl(e, isApicultor) {
    const defaultProfileImageB = "beatriz.jpg";
    const defaultProfileImageF = "farmer.png";
    const defaultProfileCover = "default-cover.png";
  
    const profileImage = isApicultor
      ? e.Apic_Foto_Perfil || defaultProfileImageB
      : e.Agri_Foto_Perfil || defaultProfileImageF;
    const profileCover = isApicultor
      ? e.Apic_Foto_Capa || defaultProfileCover
      : e.Agri_Foto_Capa || defaultProfileCover;
  
    // Construir os caminhos completos para as URLs e verificar se os arquivos existem
    const imagePath = "./public/upload/perfil/";
    const profileImagePath = fs.existsSync(`${imagePath}${profileImage}`)
      ? profileImage
      : isApicultor
      ? defaultProfileImageB
      : defaultProfileImageF;
    const profileCoverPath = fs.existsSync(`${imagePath}${profileCover}`)
      ? profileCover
      : defaultProfileCover;
  
    return {
      profileImage: `${API_URL}/public/upload/perfil/${profileImagePath}`,
      profileCover: `${API_URL}/public/upload/perfil/${profileCoverPath}`,
    };
  }
  

module.exports = {
    async listarChat(request, response) {
        try {
            const { Apic_Id, Agri_Id } = request.query;  // Recebe Apic_Id e Agri_Id como parâmetros

            const sql = `SELECT Chat_Id FROM Chat WHERE Apic_Id = ? AND Agri_Id = ? AND Chat_Ativo = 1`;

            const result = await db.query(sql, [Apic_Id, Agri_Id]);

            return response.status(200).json({
                sucesso: true,
                dados: result[0],
            });
        } catch (error) {
            return response.status(500).json({
                sucesso: false,
                mensagem: 'Erro ao listar o chat.',
                dados: error.message,
            });
        }
    },

    async listarMensagens(request, response) {
        try {
            const { chatId } = request.params; // Certifique-se de usar `params`
    
            const sql = `
                SELECT Chat_Mensagem, Chat_Midia, Chat_Dta_Hora, Apic_Id, Agri_Id
                FROM Chat
                WHERE Chat_Id = ? AND Chat_Ativo = 1;
            `;
            const [messages] = await db.query(sql, [chatId]);
    
            if (messages.length === 0) {
                return response.status(404).json({
                    sucesso: false,
                    mensagem: "Nenhuma mensagem encontrada para este chat.",
                    dados: [],
                });
            }
    
            return response.status(200).json({
                sucesso: true,
                dados: messages,
            });
        } catch (error) {
            return response.status(500).json({
                sucesso: false,
                mensagem: "Erro ao listar mensagens.",
                dados: error.message,
            });
        }
    },
    async cadastrarChat(request, response) {
        try {
          const { Chat_Mensagem, Chat_Visto, Apic_Id, Agri_Id, Chat_Ativo, Chat_Dta_Hora } = request.body;
      
          // Verificar se o Apicultor e Agricultor existem no banco de dados
          const apicCheck = await db.query("SELECT * FROM Apicultor WHERE Apic_Id = ?", [Apic_Id]);
          if (apicCheck[0].length === 0) {
            return response.status(400).json({ sucesso: false, mensagem: "Apicultor não encontrado." });
          }
      
          const agriCheck = await db.query("SELECT * FROM Agricultor WHERE Agri_Id = ?", [Agri_Id]);
          if (agriCheck[0].length === 0) {
            return response.status(400).json({ sucesso: false, mensagem: "Agricultor não encontrado." });
          }
      
          // Inserir a nova mensagem no banco de dados
          const sql = `
            INSERT INTO Chat (Chat_Mensagem, Chat_Visto, Apic_Id, Agri_Id, Chat_Ativo, Chat_Dta_Hora)
            VALUES (?, ?, ?, ?, ?, ?)
          `;
          const values = [Chat_Mensagem, Chat_Visto, Apic_Id, Agri_Id, Chat_Ativo, Chat_Dta_Hora];
          const result = await db.query(sql, values);
      
          return response.status(200).json({ sucesso: true, dados: result[0].insertId });
        } catch (error) {
          return response.status(500).json({ sucesso: false, mensagem: "Erro ao enviar a mensagem.", dados: error.message });
        }
      },
            
      async listarChatsPorUsuario(request, response) {
        try {
            const { Usu_Id } = request.params; // Recebe o ID do usuário como parâmetro
            if (!Usu_Id) {
              return response.status(400).json({
                sucesso: false,
                mensagem: "Usuário não especificado.",
              });
            }
        
            // Verificar se o usuário é apicultor ou agricultor
            const [isApicultor] = await db.query(
              `SELECT Apic_Id FROM Apicultor WHERE Usu_Id = ?`,
              [Usu_Id]
            );
            const [isAgricultor] = await db.query(
              `SELECT Agri_Id FROM Agricultor WHERE Usu_Id = ?`,
              [Usu_Id]
            );
        
            if (isApicultor.length === 0 && isAgricultor.length === 0) {
              return response.status(404).json({
                sucesso: false,
                mensagem: "Usuário não encontrado como apicultor ou agricultor.",
              });
            }
        
            const userType = isApicultor.length > 0 ? 1 : 2; // 1: Apicultor, 2: Agricultor
            const userIdColumn = userType === 1 ? "Apic_Id" : "Agri_Id";
            const userChatsQuery = `
              SELECT 
                c.Chat_Id, 
                CASE 
                  WHEN c.Apic_Id = ? THEN u_ag.Usu_NomeCompleto
                  WHEN c.Agri_Id = ? THEN u_ap.Usu_NomeCompleto
                END AS NomeOutroUsuario,
                CASE 
                  WHEN c.Apic_Id = ? THEN ag.Agri_Foto_Perfil
                  WHEN c.Agri_Id = ? THEN a.Apic_Foto_Perfil
                END AS FotoOutroUsuario,
                CASE 
                  WHEN c.Apic_Id = ? THEN ag.Agri_Foto_Capa
                  WHEN c.Agri_Id = ? THEN a.Apic_Foto_Capa
                END AS FotoOutroUsuarioCapa
              FROM Chat c
              LEFT JOIN Apicultor a ON c.Apic_Id = a.Apic_Id
              LEFT JOIN Agricultor ag ON c.Agri_Id = ag.Agri_Id
              LEFT JOIN Usuario u_ap ON a.Usu_Id = u_ap.Usu_Id
              LEFT JOIN Usuario u_ag ON ag.Usu_Id = u_ag.Usu_Id
              WHERE c.${userIdColumn} = ? AND c.Chat_Ativo = 1;
            `;
        
            const chats = await db.query(userChatsQuery, [
              isApicultor[0]?.Apic_Id || null,
              isAgricultor[0]?.Agri_Id || null,
              isApicultor[0]?.Apic_Id || null,
              isAgricultor[0]?.Agri_Id || null,
              isApicultor[0]?.Apic_Id || null,
              isAgricultor[0]?.Agri_Id || null,
              isApicultor[0]?.Apic_Id || isAgricultor[0]?.Agri_Id,
            ]);
        
            // Gerar URLs para imagens de perfil e capa
            const chatsWithUrls = chats[0].map((chat) => {
              const urlData = geraUrl(chat, userType);
              return {
                Chat_Id: chat.Chat_Id,
                NomeOutroUsuario: chat.NomeOutroUsuario,
                FotoOutroUsuario: urlData.profileImage,
                FotoOutroUsuarioCapa: urlData.profileCover,
              };
            });
        
            return response.status(200).json({
              sucesso: true,
              dados: chatsWithUrls,
            });
          } catch (error) {
            console.error("Erro ao listar chats por usuário:", error.message);
            return response.status(500).json({
              sucesso: false,
              mensagem: "Erro interno ao listar chats.",
              dados: error.message,
            });
          }
      },
      
      async detalhesChat(request, response) {
        try {
          const { Chat_Id } = request.params;
      
          const sql = `
            SELECT 
              c.Chat_Id, 
              a.Apic_Id, 
              ag.Agri_Id,
              u_ap.Usu_NomeCompleto AS NomeApicultor,
              u_ag.Usu_NomeCompleto AS NomeAgricultor,
              a.Apic_Foto_Perfil AS FotoPerfilApicultor,
              ag.Agri_Foto_Perfil AS FotoPerfilAgricultor,
              a.Apic_Foto_Capa AS FotoCapaApicultor,
              ag.Agri_Foto_Capa AS FotoCapaAgricultor
            FROM Chat c
            LEFT JOIN Apicultor a ON c.Apic_Id = a.Apic_Id
            LEFT JOIN Agricultor ag ON c.Agri_Id = ag.Agri_Id
            LEFT JOIN Usuario u_ap ON a.Usu_Id = u_ap.Usu_Id
            LEFT JOIN Usuario u_ag ON ag.Usu_Id = u_ag.Usu_Id
            WHERE c.Chat_Id = ? AND c.Chat_Ativo = 1;
          `;
      
          const [chatDetails] = await db.query(sql, [Chat_Id]);
      
          if (chatDetails.length === 0) {
            return response.status(404).json({
              sucesso: false,
              mensagem: "Detalhes do chat não encontrados.",
            });
          }
      
          const chat = chatDetails[0];
      
          // Gerar URLs de imagens para apicultor e agricultor
          const apicultorUrls = geraUrl(
            {
              Apic_Foto_Perfil: chat.FotoPerfilApicultor,
              Apic_Foto_Capa: chat.FotoCapaApicultor,
            },
            true
          );
          const agricultorUrls = geraUrl(
            {
              Agri_Foto_Perfil: chat.FotoPerfilAgricultor,
              Agri_Foto_Capa: chat.FotoCapaAgricultor,
            },
            false
          );
      
          return response.status(200).json({
            sucesso: true,
            dados: {
              Chat_Id: chat.Chat_Id,
              Apicultor: {
                Apic_Id: chat.Apic_Id,
                Nome: chat.NomeApicultor,
                FotoPerfil: apicultorUrls.profileImage,
                FotoCapa: apicultorUrls.profileCover,
              },
              Agricultor: {
                Agri_Id: chat.Agri_Id,
                Nome: chat.NomeAgricultor,
                FotoPerfil: agricultorUrls.profileImage,
                FotoCapa: agricultorUrls.profileCover,
              },
            },
          });
        } catch (error) {
          console.error("Erro ao buscar detalhes do chat:", error.message);
          return response.status(500).json({
            sucesso: false,
            mensagem: "Erro ao buscar detalhes do chat.",
            dados: error.message,
          });
        }
      }
};
