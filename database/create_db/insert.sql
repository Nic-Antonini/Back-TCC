
-- usuários
-- Tipos de usuário 0 - Administrador, 1 - Apicultor, 2 - Agricultor
INSERT INTO Usuario (Usu_Id, Usu_NomeCompleto, Usu_Email, Usu_Senha, Usu_Tipo) VALUES
(1, 'João Silva', 'joao.silva@example.com', 'senha123', 0), -- ADM
(2, 'Maria Oliveira', 'maria.oliveira@example.com', 'senha123', 1), -- Apicultor
(3, 'Pedro Souza', 'pedro.souza@example.com', 'senha123', 1), -- Apicultor
(4, 'Ana Paula', 'ana.paula@example.com', 'senha123', 2), -- Agricultor 
(5, 'Carlos Menezes', 'carlos.menezes@example.com', 'senha123', 2), -- Agricultor 
(6, 'Fernanda Lima', 'fernanda.lima@example.com', 'senha123', 2), -- Agricultor 
(7, 'Rafael Alves', 'rafael.alves@example.com', 'senha123',  2), -- Agricultor 
(8, 'Juliana Santos', 'juliana.santos@example.com', 'senha123', 2), -- Agricultor 
(9, 'Lucas Martins', 'lucas.martins@example.com', 'senha123', 1), -- Apicultor
(10, 'Paula Costa', 'paula.costa@example.com', 'senha123', 0); -- ADM 


-- agricultores
INSERT INTO Agricultor (Agri_Id, Agri_Foto_Perfil, Agri_Foto_Capa, Agri_Biografia, Usu_Id) VALUES
(1, 'perfil1.png', 'capa1.png', 'Agricultor com mais de 20 anos de experiência.', 4), 
(2, 'perfil5.png', 'capa5.png', 'Fazenda especializada em milho e soja.', 5),
(3, 'perfil7.png', 'capa7.png', 'Pequena propriedade com foco em produtos orgânicos.', 6), 
(4, 'perfil10.png', 'capa10.png', 'Especializada em amendoim.', 7),
(5, 'perfil15.png', 'capa15.png', 'Especializada em soja.', 8);


-- apicultores
INSERT INTO Apicultor (Apic_Id, Apic_Foto_Perfil, Apic_Foto_Capa, Apic_Biografia, Usu_Id) VALUES
(1, 'perfil2.png', 'capa2.png', 'Especialista em apicultura sustentável.', 2), 
(2, 'perfil6.png', 'capa6.png', 'Apicultor com enfoque em apicultura urbana.', 3),
(3, 'perfil8.png', 'capa8.png', 'Jovem apicultora com foco em inovação.', 9);


-- administrador
INSERT INTO Administrador (Adm_Id) VALUES
(1), (10);


-- apiários
INSERT INTO Apiarios (Apia_Id, Apia_Nome, Apia_Cidade, Apia_Estado, Apia_Lat, Apia_Lng, Apia_Caixas, Apic_Id) VALUES
(1, 'Apiário Central', 'Tupã', 'SP',-21.9340, -50.5160 , 13,  1),
(2, 'Apiário Brasil', 'Bastos', 'SP', -22.9340, -55.5160, 11,  2),
(3, 'Apiário Africano', 'Iacri', 'SP', -12.9340, -60.5160, 23, 3);


-- colméia
INSERT INTO Colmeia (Colm_Id, Apia_Id) VALUES
(1, 2),
(2, 2),
(3, 1),
(4, 3);


-- espécie
INSERT INTO Especie (Espe_Id, Espe_Nome) VALUES
(1, 'Jataí'),
(2, 'Mandaçaia'),
(3, 'Uruçu'),
(4, 'Manduri');


-- colméia_espécie
INSERT INTO Colmeia_Especie (Colm_Espe_Id, Colm_Id, Espe_Id) VALUES
(1, 3, 3),
(2, 1, 4),
(3, 4, 2),
(4, 2, 1);


-- propriedades
INSERT INTO Propriedade (Prop_Id, Prop_Nome, Prop_Hectare, Prop_Cidade, Prop_Estado, Prop_Lat, Prop_Lng, Agri_Id) VALUES
(1, 'Fazenda Bela Vista', 10, 'Tupã', 'SP', -21.9440, -50.6160,  1), 
(2, 'Fazenda Nova Esperança', 30, 'Iacri', 'SP', -22.9440, -49.6160, 2),
(3, 'Chácara Boa Vista', 11, 'Assis', 'SP', -21.9440, -30.6160, 3),
(4, 'Sítio Amarelo', 8, 'Tupã', 'SP', -45.9440, -50.6160,  4);


-- cultivo
INSERT INTO Cultivo (Cult_Id, Cult_Nome, Cult_Agrotoxico, Prop_Id) VALUES
(1, 'Milho', 1, 3 ),
(2, 'Soja', 0, 4 ),
(3, 'Trigo', 0, 2 ),
(4, 'Milho', 1, 1);


-- cultivo_propriedade
INSERT INTO Cultivo_Propriedade (Cult_Prop_Id, Cult_Id, Prop_Id) VALUES
(1, 3, 2),
(2, 2, 4),
(3, 4, 1 ),
(4, 1, 3 );


-- conexão
INSERT INTO Conexao (Con_Id, Con_Salvar, Usu_Id) VALUES
(1, 0, 1),
(2, 1, 4),
(3, 1, 9),
(4, 0, 5);


-- galeria
INSERT INTO Galeria (Gale_Id, Gale_Foto, Usu_Id) VALUES
(1, 'img1.jpg', 4),
(2, 'img2.jpg', 4),
(3, 'img3.jpg', 5),
(4, 'img4.jpg', 5),
(5, 'img5.jpg', 5),
(6, 'img6.jpg', 2),
(7, 'img7.jpg', 3),
(8, 'img8.jpg', 3),
(9, 'img9.jpg', 6); 


-- chat
INSERT INTO Chat (Chat_Id, Chat_Mensagem, Chat_Midia, Chat_Dta_Hora, Chat_Visto, Apic_Id, Agri_Id) VALUES
(1, 'Olá, precisamos discutir sobre a polinização.', 'audio.mp3', '2024-03-01 14:30:00', 1, 2, 4), 
(2, 'Podemos discutir sobre a colheita?', 'video.mp4', '2024-03-02 09:00:00', 1, 2, 4),
(3, 'Quais tipos de abelha vocês tem?', null , '2024-03-15 16:45:00', 1, 2, 4),
(4, 'Temos vários tipos. Segue a imagem:', 'image.jpg', '2024-03-15 16:55:00', 1, 2, 4),
(5, 'Gostaria de fazer um empréstimo com você', null, '2024-06-17 17:45:00', 1, 2, 4),
(6, 'Qual a quantidade de colmeias que você gostaria?', null, '2024-06-18 16:45:00', 0, 2, 4);




