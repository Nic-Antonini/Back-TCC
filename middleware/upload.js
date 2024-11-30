const multer = require('multer');

// Definindo o armazenamento
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/upload/perfil'); // Diretório de destino
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9); // Gerar um sufixo único
    const ext = file.mimetype === 'image/jpeg' ? '.jpeg' : file.mimetype.slice(file.mimetype.length - 4); // Garantir a extensão correta
    cb(null, file.fieldname + '-' + uniqueSuffix + ext); // Nome do arquivo gerado
  }
});

// Filtro de tipo de arquivo
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true); // Permitir arquivo
  } else {
    cb(null, false); // Não permitir
  }
};

// Configurações do multer
module.exports = multer({
  storage: storage, // Configuração de armazenamento
  limits: {
    fileSize: 1024 * 1024 * 5 // Limite de 5MB por arquivo
  },
  fileFilter: fileFilter // Filtro de arquivos
});
