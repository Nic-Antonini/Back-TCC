use bd_tcc_etim_122_g1;

CREATE TABLE Usuario (
    Usu_Id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    Usu_NomeCompleto VARCHAR(255) NOT NULL,
    Usu_Email VARCHAR(255) NOT NULL,
    Usu_Senha VARCHAR(100) NOT NULL,
    Usu_Tipo TINYINT NOT NULL
);


CREATE TABLE Agricultor (
    Agri_Id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    Agri_Foto_Perfil VARCHAR(255), 
    Agri_Foto_Capa VARCHAR(255), 
    Agri_Biografia VARCHAR(150),
    Usu_Id INT NOT NULL,
    FOREIGN KEY (Usu_Id) REFERENCES Usuario(Usu_Id)
);


CREATE TABLE Apicultor (
    Apic_Id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    Apic_Foto_Perfil VARCHAR(100), 
    Apic_Foto_Capa VARCHAR(100), 
    Apic_Biografia VARCHAR(150),
	Usu_Id INT NOT NULL,
    FOREIGN KEY (Usu_Id) REFERENCES Usuario(Usu_Id)
);


CREATE TABLE Administrador (
    Adm_Id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    FOREIGN KEY (Adm_Id) REFERENCES Usuario(Usu_Id)
);
 

CREATE TABLE Apiarios (
    Apia_Id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    Apia_Nome VARCHAR(30) NOT NULL,
    Apia_Cidade VARCHAR(100) NOT NULL, 
    Apia_Estado VARCHAR(100) NOT NULL,
    Apia_Lat DECIMAL(11,8) NOT NULL,
    Apia_Lng DECIMAL(11,8) NOT NULL,
    Apia_Caixas INT NOT NULL,
    Apic_Id INT NOT NULL,
    FOREIGN KEY (Apic_Id) REFERENCES Apicultor(Apic_Id)
);


CREATE TABLE Colmeia (
    Colm_Id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    Apia_Id INT NOT NULL,
    FOREIGN KEY (Apia_Id) REFERENCES Apiarios(Apia_Id)
);

CREATE TABLE Especie (
	Espe_Id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    Espe_Nome VARCHAR(100) NOT NULL
);

CREATE TABLE Colmeia_Especie (
	Colm_Espe_Id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
	Colm_Id INT NOT NULL,
	Espe_Id INT NOT NULL,
	FOREIGN KEY (Colm_Id) REFERENCES Colmeia (Colm_Id),
	FOREIGN KEY (Espe_Id) REFERENCES Especie (Espe_Id)
);


CREATE TABLE Propriedade (
    Prop_Id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    Prop_Nome VARCHAR(100) NOT NULL, 
    Prop_Hectare DECIMAL(10,2) NOT NULL, 
    Prop_Cidade VARCHAR(100) NOT NULL, 
    Prop_Estado VARCHAR(100) NOT NULL, 
    Prop_Lat DECIMAL(11,8) NOT NULL,
    Prop_Lng DECIMAL(11,8) NOT NULL,
    Agri_Id INT NOT NULL,
    FOREIGN KEY (Agri_Id) REFERENCES Agricultor(Agri_Id)
);


CREATE TABLE Cultivo (
    Cult_Id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    Cult_Nome VARCHAR(100) NOT NULL,
    Cult_Agrotoxico BIT (1) NOT NULL,
    Prop_Id INT NOT NULL,
    FOREIGN KEY (Prop_Id) REFERENCES Propriedade(Prop_Id)
); 


CREATE TABLE Cultivo_Propriedade (
	Cult_Prop_Id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    Cult_Id INT NOT NULL,
    Prop_Id INT NOT NULL,
	FOREIGN KEY (Cult_Id) REFERENCES Cultivo (Cult_Id),
	FOREIGN KEY (Prop_Id) REFERENCES Propriedade (Prop_Id)
);


CREATE TABLE Conexao (
    Con_Id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    Con_Salvar BIT (1) NOT NULL,
    Usu_Id INT NOT NULL,
    FOREIGN KEY (Usu_Id) REFERENCES Usuario(Usu_Id)
);


CREATE TABLE Galeria (
	Gale_Id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    Gale_Foto VARCHAR (255) NOT NULL, 
    Usu_Id INT NOT NULL, 
    FOREIGN KEY (Usu_Id) REFERENCES Usuario(Usu_Id)
);


CREATE TABLE Chat (
    Chat_Id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    Chat_Mensagem VARCHAR(255) NOT NULL,
    Chat_Midia VARCHAR(255), 
    Chat_Dta_Hora DATETIME NOT NULL, 
    Chat_Visto BOOLEAN NOT NULL,
    Apic_Id INT NOT NULL,
    Agri_Id INT NOT NULL,
    FOREIGN KEY (Apic_Id) REFERENCES Apicultor(Apic_Id),
    FOREIGN KEY (Agri_Id) REFERENCES Agricultor(Agri_Id)
);


