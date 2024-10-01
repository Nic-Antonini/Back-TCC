use bd_tcc_etim_122_g1;

ALTER TABLE Agricultor ADD CONSTRAINT Usuario FOREIGN KEY (Usu_Id) REFERENCES Usuario(Usu_Id);

ALTER TABLE Apicultor ADD CONSTRAINT Usuario FOREIGN KEY (Usu_Id) REFERENCES Usuario(Usu_Id);

ALTER TABLE Administrador ADD CONSTRAINT Usuario FOREIGN KEY (Usu_Id) REFERENCES Usuario(Usu_Id);

ALTER TABLE Apiarios ADD CONSTRAINT Apicultor FOREIGN KEY (Usu_Id) REFERENCES Apicultor(Usu_Id);

ALTER TABLE Colmeia ADD CONSTRAINT  Apiarios FOREIGN KEY (Apia_Id) REFERENCES Apiarios(Apia_Id);

ALTER TABLE Colmeia_Especie ADD CONSTRAINT Colmeia FOREIGN KEY (Colm_Id) REFERENCES Colmeia(Colm_Id);

ALTER TABLE Colmeia_Especie ADD CONSTRAINT Especie FOREIGN KEY (Espe_Id) REFERENCES Especie(Espe_Id);

ALTER TABLE Propriedade ADD CONSTRAINT Agricultor FOREIGN KEY (Agri_Id) REFERENCES Agricultor(Agri_Id);

ALTER TABLE Cultivo ADD CONSTRAINT Propriedade FOREIGN KEY (Prop_Id) REFERENCES Propriedade(Prop_Id);

ALTER TABLE Cultivo_Propriedade ADD CONSTRAINT Propriedade FOREIGN KEY (Prop_Id) REFERENCES Propriedade(Prop_Id);

ALTER TABLE Cultivo_Propriedade ADD CONSTRAINT Cultivo FOREIGN KEY (Cult_Id) REFERENCES Cultivo(Cult_Id);

ALTER TABLE Conexao ADD CONSTRAINT Usuario FOREIGN KEY (Usu_Id) REFERENCES Usuario(Usu_Id);

ALTER TABLE Galeria ADD CONSTRAINT Usuario FOREIGN KEY (Usu_Id) REFERENCES Usuario(Usu_Id);

ALTER TABLE Chat ADD CONSTRAINT Apicultor FOREIGN KEY (Apic_Id) REFERENCES Apicultor(Apic_Id);

ALTER TABLE Chat ADD CONSTRAINT Agricultor FOREIGN KEY (Agri_Id) REFERENCES Agricultor(Agri_Id);