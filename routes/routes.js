const express = require('express');
const router = express.Router(); //armazenando a função Router do módulo express dentro de uma const

// referência a controllers que serão utilizados nas rotas
// post
// patch
// delete

const UsuariosController = require('../controllers/usuarios'); 

router.get('/usuarios', UsuariosController.listarUsuarios); 
router.post('/usuarios', UsuariosController.cadastrarUsuarios); 
router.patch('/usuarios', UsuariosController.editarUsuarios); 
router.delete('/usuarios', UsuariosController.apagarUsuarios); 


const AdministradorController = require('../controllers/administrador'); 

router.get('/administrador', AdministradorController.listarAdministradores); 
router.get('/administrador/:id', AdministradorController.listarAdministradorPorId); 
router.post('/administrador', AdministradorController.cadastrarAdministrador); 
router.patch('/administrador', AdministradorController.editarAdministrador); 
router.delete('/administrador', AdministradorController.apagarAdministrador); 


const ApicultorController = require('../controllers/apicultor'); 

router.get('/apicultor',ApicultorController.listarApicultores);
router.get('/apicultor/:id', ApicultorController.listarApicultorPorId); 
router.post('/apicultor', ApicultorController.cadastrarApicultores); 
router.patch('/apicultor', ApicultorController.editarApicultores); 
router.delete('/apicultor', ApicultorController.apagarApicultores); 


const AgricultorController = require('../controllers/agricultor'); 

router.get('/agricultor', AgricultorController.listarAgricultores);
router.get('/agricultor/:id', AgricultorController.listarAgricultorPorId);  
router.post('/agricultor', AgricultorController.cadastrarAgricultor); 
router.patch('/agricultor', AgricultorController.editarAgricultores); 
router.delete('/agricultor', AgricultorController.apagarAgricultores); 


const ApiarioController = require('../controllers/apiarios'); 

router.get('/apiarios', ApiarioController.listarApiarios); 
router.get('/apiarios/:id', ApiarioController.listarApiariosPorId);
router.post('/apiarios', ApiarioController.cadastrarApiarios); 
router.patch('/apiarios', ApiarioController.editarApiarios); 
router.delete('/apiarios', ApiarioController.apagarApiarios); 


const ChatController = require('../controllers/chat'); 

router.get('/chat', ChatController.listarChats);
router.get('/chat/:id', ChatController.listarChatsPorId);
router.post('/chat', ChatController.cadastrarChats); 
router.patch('/chat', ChatController.editarChats); 
router.delete('/chat', ChatController.apagarChats);


const ColmeiaController = require('../controllers/colmeia'); 

router.get('/colmeia', ColmeiaController.listarColmeia); 
router.get('/colmeia/:id', ColmeiaController.listarColmeiaPorId);
router.post('/colmeia', ColmeiaController.cadastrarColmeia); 
router.patch('/colmeia', ColmeiaController.editarColmeia); 
router.delete('/colmeia', ColmeiaController.apagarColmeia); 


const ColmeiaEspecieController = require('../controllers/colmeia_especie'); 

router.get('/colmeia_especie', ColmeiaEspecieController.listarColmeiaEspecie); 
router.get('/colmeia_especie/:id', ColmeiaEspecieController.listarColmeiaEspeciePorId);
router.post('/colmeia_especie', ColmeiaEspecieController.cadastrarColmeiaEspecie); 
router.patch('/colmeia_especie', ColmeiaEspecieController.editarColmeiaEspecie); 
router.delete('/colmeia_especie', ColmeiaEspecieController.apagarColmeiaEspecie); 


const ConexaoController = require('../controllers/conexao'); 

router.get('/conexao', ConexaoController.listarConexao); 
router.get('/conexao/:id', ConexaoController.listarConexaoPorId);
router.post('/conexao', ConexaoController.cadastrarConexao); 
router.patch('/conexao', ConexaoController.editarConexao); 
router.delete('/conexao', ConexaoController.apagarConexao); 


const CultivoController = require('../controllers/cultivo'); 

router.get('/cultivo', CultivoController.listarCultivo); 
router.get('/cultivo/:id', CultivoController.listarCultivoPorId);
router.post('/cultivo', CultivoController.cadastrarCultivo); 
router.patch('/cultivo', CultivoController.editarCultivo); 
router.delete('/cultivo', CultivoController.apagarCultivo); 


const CultivoPropriedadeController = require('../controllers/cultivo_propriedade'); 

router.get('/cultivo_propriedade', CultivoPropriedadeController.listarCultivoPropriedade); 
router.get('/cultivo_propriedade/:id', CultivoPropriedadeController.listarCultivoPropriedadePorId);
router.post('/cultivo_propriedade', CultivoPropriedadeController.cadastrarCultivoPropriedade); 
router.patch('/cultivo_propriedade', CultivoPropriedadeController.editarCultivoPropriedade); 
router.delete('/cultivo_propriedade', CultivoPropriedadeController.apagarCultivoPropriedade); 


const EspecieController = require('../controllers/especie'); 

router.get('/especie', EspecieController.listarEspecie); 
router.get('/especie/:id', EspecieController.listarEspeciePorId);
router.post('/especie', EspecieController.cadastrarEspecie); 
router.patch('/especie', EspecieController.editarEspecie); 
router.delete('/especie', EspecieController.apagarEspecie); 


const GaleriaController = require('../controllers/galeria'); 

router.get('/galeria', GaleriaController.listarGaleria); 
router.get('/galeria/:id', GaleriaController.listarGaleriaPorId);
router.post('/galeria', GaleriaController.cadastrarGaleria); 
router.patch('/galeria', GaleriaController.editarGaleria); 
router.delete('/galeria', GaleriaController.apagarGaleria);

const PropriedadeController = require('../controllers/propriedade'); 

router.get('/propriedade', PropriedadeController.listarPropriedade); 
router.get('/propriedade/:id', PropriedadeController.listarPropriedadePorId);
router.post('/propriedade', PropriedadeController.cadastrarPropriedade); 
router.patch('/propriedade', PropriedadeController.editarPropriedade); 
router.delete('/propriedade', PropriedadeController.apagarPropriedade); 



module.exports = router;