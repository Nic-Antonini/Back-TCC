const express = require('express');
const router = express.Router();
const authentication = require('../middleware/authentication');
const uploadImg = require('../middleware/upload')

// Referência a controllers que serão utilizados nas rotas
const UsuariosController = require('../controllers/usuarios'); 

router.get('/usuarios', UsuariosController.listarUsuarios);
router.get('/usuarios/:Usu_Id', UsuariosController.listarDadosUsuario);
router.post('/usuarios', UsuariosController.cadastrarUsuarios); 
router.patch('/usuarios/:Usu_Id',   uploadImg.fields([
    { name: 'profileImage', maxCount: 1 },
    { name: 'profileCover', maxCount: 1 },
  ]), UsuariosController.atualizarDadosUsuario); 
router.delete('/usuarios/del/:Usu_Id', UsuariosController.ocultarUsuario);
router.post('/usuarios/login', UsuariosController.login);
router.get('/protecao', authentication, (req, res) => {
    return res.status(200).json({
        sucesso: true,
        mensagem: 'Você tem acesso à rota protegida.'
    });
});


const ApicultorController = require('../controllers/apicultor'); 

router.get('/apicultor', ApicultorController.listarApicultor); 
router.post('/apicultor', ApicultorController.cadastrarApicultor);    
router.patch('/apicultor/:Apic_Id', ApicultorController.editarApicultor); 
router.delete('/apicultor/:Usu_Id', ApicultorController.apagarApicultor);


const AgricultorController = require('../controllers/agricultor'); 

router.get('/agricultor', AgricultorController.listarAgricultor); 
router.post('/agricultor', AgricultorController.cadastrarAgricultor);
router.patch('/agricultor/:Agri_Id', AgricultorController.editarAgricultor);
router.delete('/agricultor/:Usu_Id', AgricultorController.apagarAgricultor);

const ApiariosController = require('../controllers/apiarios'); 

router.get('/apiarios', ApiariosController.listarApiarios); 
router.post('/apiarios', ApiariosController.cadastrarApiarios); 
router.patch('/apiarios/:Apia_Id', ApiariosController.editarApiarios); 
router.delete('/apiarios/del/:Apia_Id', ApiariosController.ocultarApiarios);



const ChatController = require('../controllers/chat'); 

router.get('/chat', ChatController.listarChat); 
router.post('/chat', ChatController.cadastrarChat);
router.patch('/chat/:Chat_Id', ChatController.editarChat); 
router.delete('/chat/del/:Chat_Id', ChatController.ocultarChat);



const EspecieApiarioController = require('../controllers/especie_apiario'); 

router.get('/especie_apiario', EspecieApiarioController.listarEspecieApiario); 
router.post('/especie_apiario', EspecieApiarioController.cadastrarEspecieApiario); 
router.patch('/especie_apiario/:Espe_Apia_Id', EspecieApiarioController.editarEspecieApiario); 
router.delete('/especie_apiario/del/:Espe_Apia_Id', EspecieApiarioController.ocultarEspecieApiario);

const ConexaoController = require('../controllers/conexao'); 

router.get('/conexao', ConexaoController.listarConexao); 
router.post('/conexao', ConexaoController.cadastrarConexao); 
router.patch('/conexao/:Con_Id', ConexaoController.editarConexao); 
router.delete('/conexao/:Con_Id', ConexaoController.apagarConexao); 

const CultivoController = require('../controllers/cultivo'); 

router.get('/cultivo', CultivoController.listarCultivo); 
router.post('/cultivo', CultivoController.cadastrarCultivo); 
router.patch('/cultivo/:Cult_Id', CultivoController.editarCultivo); 
router.delete('/cultivo/del/:Cult_Id', CultivoController.ocultarCultivo);



const CultivoPropriedadeController = require('../controllers/cultivo_propriedade'); 

router.get('/cultivo_propriedade', CultivoPropriedadeController.listarCultivoPropriedade); 
router.post('/cultivo_propriedade', CultivoPropriedadeController.cadastrarCultivoPropriedade); 
router.patch('/cultivo_propriedade/:Cult_Prop_Id', CultivoPropriedadeController.editarCultivoPropriedade); 
router.delete('/cultivo_propriedade/del/:Cult_Prop_Id', CultivoPropriedadeController.ocultarCultivoPropriedade);


const EspecieController = require('../controllers/especie'); 

router.get('/especie', EspecieController.listarEspecie); 
//router.get('/especie/:id', EspecieController.listarEspeciePorId);
router.post('/especie', EspecieController.cadastrarEspecie); 
router.patch('/especie/:Espe_Id', EspecieController.editarEspecie); 
router.delete('/especie/:Espe_Id', EspecieController.apagarEspecie); 

const PropriedadeController = require('../controllers/propriedade'); 

router.get('/propriedade', PropriedadeController.listarPropriedade); 
router.post('/propriedade', PropriedadeController.cadastrarPropriedade); 
router.patch('/propriedade/:Prop_Id', PropriedadeController.editarPropriedade); 
router.delete('/propriedade/del/:Prop_Id', PropriedadeController.ocultarPropriedade);


module.exports = router;