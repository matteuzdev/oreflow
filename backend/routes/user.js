// backend/routes/user.js
const express = require('express');
const router = express.Router();
const db = require('../database');
const auth = require('../middleware/auth');

// Obter perfil do usuário logado
router.get('/profile', auth, (req, res) => {
  db.get(`SELECT id, name, email, photo_url, role FROM users WHERE id = ?`, [req.userId], (err, user) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!user) return res.status(404).json({ msg: "Usuário não encontrado" });
    res.json(user);
  });
});

// Atualizar perfil do usuário logado
router.put('/profile', auth, (req, res) => {
  const { name, photo_url } = req.body;
  db.run(`UPDATE users SET name = ?, photo_url = ? WHERE id = ?`,
    [name, photo_url, req.userId],
    function(err) {
      if (err) return res.status(400).json({ error: err.message });
      res.json({ message: "Perfil atualizado com sucesso", name, photo_url });
    });
});

module.exports = router;
