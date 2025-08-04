// backend/middleware/adminAuth.js
function adminAuth(req, res, next) {
  if (req.role !== 'admin') {
    return res.status(403).json({ msg: 'Acesso negado. Requer privilégios de administrador.' });
  }
  next();
}

module.exports = adminAuth;
