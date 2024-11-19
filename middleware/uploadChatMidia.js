const multer = require('multer');
const path = require('path');
const fs = require('fs-extra');

// Configurar o armazenamento
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = './public/upload/chat';
    fs.ensureDirSync(uploadPath); // Certifica que a pasta existe
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// Permitir vários tipos de mídia
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/', 'video/', 'audio/', 'application/pdf'];
  if (allowedTypes.some(type => file.mimetype.startsWith(type))) {
    cb(null, true);
  } else {
    cb(new Error('Formato de arquivo não suportado'), false);
  }
};

module.exports = multer({
  storage: storage,
  fileFilter: fileFilter,
});


