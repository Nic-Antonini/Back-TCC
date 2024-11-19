const jwt = require('jsonwebtoken');

// Middleware para verificar o JWT
function verificarToken(req, res, next) {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(403).json({
            sucesso: false,
            mensagem: 'Token não fornecido.'
        });
    }

    // Remove o "Bearer" do início do token
    const tokenSemBearer = token.split(' ')[1];

    jwt.verify(tokenSemBearer, 'secrect_key', (err, decoded) => {
        if (err) {
            return res.status(401).json({
                sucesso: false,
                mensagem: 'Token inválido.'
            });
        }

        // Adiciona os dados do usuário ao request
        req.userId = decoded.userId;
        req.userType = decoded.userType;
        req.email = decoded.email;

        next();
    });
}

module.exports = verificarToken;
