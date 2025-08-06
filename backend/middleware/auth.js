// backend/middleware/auth.js
require('dotenv').config({ path: '../.env.local' }); // Carrega as variáveis de ambiente
const jwt = require('jsonwebtoken');

function auth(req, res, next) {
  const token = req.header('x-auth-token');
  if (!token) {
    return res.status(401).json({ msg: 'Nenhum token, autorização negada' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Adiciona o payload decodificado ao request
    req.userId = decoded.userId;
    req.organization_id = decoded.organization_id;
    req.role = decoded.role;
    next();
  } catch (e) {
    res.status(400).json({ msg: 'Token inválido' });
  }
}

module.exports = auth;
