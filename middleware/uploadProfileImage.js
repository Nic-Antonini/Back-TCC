// middleware/uploadImageProfile.js
const multer = require('multer');

// Configuração do armazenamento para as imagens de perfil
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/upload/profileImage/'); // Pasta de destino
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = file.mimetype === 'image/jpeg' ? '.jpeg' : file.mimetype.slice(file.mimetype.length - 3);
        cb(null, file.fieldname + '-' + uniqueSuffix + ext); // Nome único para cada imagem
    }
});

const fileFilter = (req, file, cb) => {
    // Aceita apenas imagens PNG, JPEG, ou JPG
    if (file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

module.exports = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 5 },  // Limite de 5MB por arquivo
    fileFilter: fileFilter
});
