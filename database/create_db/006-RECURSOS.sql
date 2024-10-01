-- SELECT COM TODOS OS CAMPOS (Alterado)

select * from conexao; 
select * from chat; 
select * from administrador;
select * from galeria;
select * from colmeia_especie; 
select * from especie;
select * from cultivo_propriedade;
select * from colmeia; 
select * from apiarios; 
select * from cultivo; 
select * from propriedade; 
select * from agricultor; 
select * from apicultor; 
select * from usuario; 


-- DROP DE TODAS AS TABELAS NA ORDEM DE EXCLUSÃO (Alterado)
drop table Conexao;
drop table Chat;
drop table Administrador;
drop table Galeria; 
drop table Colmeia_especie; 
drop table Especie; 
drop table Cultivo_propriedade;
drop table Colmeia;
drop table Apiarios;
drop table Cultivo;
drop table Propriedade;
drop table Agricultor;
drop table Apicultor;
drop table Usuario; 


-- DESCRIBE DE TODAS AS TABELAS (Alterado)
DESCRIBE conexao;
DESCRIBE chat;
DESCRIBE galeria;
DESCRIBE administrador;
DESCRIBE colmeia_especie;
DESCRIBE especie;
DESCRIBE cultivo_propriedade;
DESCRIBE colmeia;
DESCRIBE apiarios; 
DESCRIBE cultivo; 
DESCRIBE propriedade;
DESCRIBE agricultor; 
DESCRIBE apicultor; 
DESCRIBE usuario;

-- INSTRUÇÃO PARA APAGAR OS REGISTROS (Alterado)
DELETE table Conexao;
DELETE table Chat;
DELETE table Administrador;
DELETE table Galeria; 
DELETE table Colmeia_especie; 
DELETE table Especie; 
DELETE table Cultivo_propriedade;
DELETE table Colmeia;
DELETE table Apiarios;
DELETE table Cultivo;
DELETE table Propriedade;
DELETE table Agricultor;
DELETE table Apicultor;
DELETE table Usuario;

-- RESETAR AUTO INCREMENTO  (Alterado)
ALTER TABLE Usuarios AUTO_INCREMENT = 1;
ALTER TABLE Conexao AUTO_INCREMENT = 1;
ALTER TABLE Chat AUTO_INCREMENT = 1;
ALTER TABLE Administrador AUTO_INCREMENT = 1;
ALTER TABLE Apiarios AUTO_INCREMENT = 1;
ALTER TABLE Colmeia AUTO_INCREMENT = 1;
ALTER TABLE Especie AUTO_INCREMENT = 1;
ALTER TABLE Colmeia_especie AUTO_INCREMENT = 1;
ALTER TABLE Propriedade AUTO_INCREMENT = 1;
ALTER TABLE Cultivo AUTO_INCREMENT = 1;
ALTER TABLE Cultivo_Propriedade AUTO_INCREMENT = 1;
ALTER TABLE Galeria AUTO_INCREMENT = 1;
ALTER TABLE Apicultor AUTO_INCREMENT = 1;
ALTER TABLE Agricultor AUTO_INCREMENT = 1;


-- COMANDOS API

SELECT usu_id FROM usuarios 
WHERE usu_email = 'gbezsousa@gmail.com';

SELECT usu_id, usu_nome, usu_tipo FROM usuarios 
WHERE usu_email = 'gbezsousa@gmail.com' AND usu_senha = '123' AND usu_ativo = 1;

SELECT DISTINCT cid_uf FROM cidades ORDER BY cid_uf ASC;

SELECT 
prd.prd_id, prd.prd_nome, prd.prd_valor, prd.prd_unidade, pdt.ptp_icone, prd.prd_img, prd.prd_descricao 
FROM produtos prd 
INNER JOIN produto_tipos pdt ON pdt.ptp_id = prd.ptp_id 
WHERE prd.prd_disponivel = 1 AND prd.prd_nome LIKE '%%' AND prd.ptp_id LIKE '%%' AND prd.prd_valor < 1000; 

SELECT MAX(prd_valor) vlr_max FROM produtos; 

-- listar ingredientes do produto
SELECT ing.ing_nome 
FROM produto_ingredientes pi 
INNER JOIN ingredientes ing ON ing.ing_id = pi.ing_id 
WHERE pi.prd_id = 1 AND pi.prd_ing_adicional = 0; 

-- listar opções de adicionais do produto
SELECT ing.ing_nome 
FROM produto_ingredientes pi 
INNER JOIN ingredientes ing ON ing.ing_id = pi.ing_id 
WHERE pi.prd_id = 1 AND pi.prd_ing_adicional = 1;  

-- listar clientes (repete devido a inserção de mais de um endereço por cliente)
SELECT us.usu_nome, us.usu_dt_nasc, cli.cli_cel, cli.cli_pts, cid.cid_nome  
FROM clientes cli 
RIGHT JOIN usuarios us ON us.usu_id 
INNER JOIN endereco_clientes edcl ON edcl.usu_id = cli.usu_id 
INNER JOIN cidades cid ON cid.cid_id = edcl.cid_id 
WHERE us.usu_ativo = 1 AND cli.cli_cel = '11988885678';  

-- só traz o cliente com endereço principal
SELECT us.usu_nome, us.usu_dt_nasc, cl.cli_cel, cl.cli_pts, cid.cid_nome FROM clientes cl
INNER JOIN usuarios us ON us.usu_id = cl.usu_id 
INNER JOIN endereco_clientes edcl ON edcl.usu_id = cl.usu_id 
INNER JOIN cidades cid ON cid.cid_id = edcl.cid_id 
WHERE us.usu_ativo = 1 AND edcl.end_principal = 1 AND cl.cli_cel = '11988885678';  

-- lista mesmo sem ter o endereço
SELECT us.usu_nome, us.usu_dt_nasc, cl.cli_cel, cl.cli_pts, cid.cid_nome 
FROM clientes cl
INNER JOIN usuarios us ON us.usu_id = cl.usu_id 
LEFT JOIN endereco_clientes edcl ON edcl.usu_id = cl.usu_id AND edcl.end_principal = 1
LEFT JOIN cidades cid ON cid.cid_id = edcl.cid_id 
WHERE us.usu_ativo = 1 AND cl.cli_cel = '11988885678'; 

-- lista verificando o endereço principal se houver endereço cadastrado
SELECT 
    us.usu_nome, 
    us.usu_dt_nasc, 
    cl.cli_cel, 
    cl.cli_pts, 
    cid.cid_nome 
FROM clientes cl
INNER JOIN usuarios us ON us.usu_id = cl.usu_id 
LEFT JOIN (
    SELECT 
        edcl.usu_id, 
        edcl.cid_id 
    FROM endereco_clientes edcl 
    WHERE edcl.end_principal = 1
) edcl_principal ON edcl_principal.usu_id = cl.usu_id
LEFT JOIN cidades cid ON cid.cid_id = edcl_principal.cid_id 
WHERE us.usu_ativo = 1 
AND cl.cli_cel = '18912345678'; -- 11988885678 18912345678