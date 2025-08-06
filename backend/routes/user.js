// backend/routes/user.js
const express = require('express');
const router = express.Router();
const db = require('../database');
const auth = require('../middleware/auth');
const bcrypt = require('bcryptjs');

// Obter perfil do usuário logado
router.get('/profile', auth, async (req, res) => {
  try {
    const { rows, rowCount } = await db.query('SELECT id, name, email, photo_url, role FROM users WHERE id = $1', [req.userId]);
    if (rowCount === 0) return res.status(404).json({ msg: "Usuário não encontrado" });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Atualizar perfil do usuário logado
router.put('/profile', auth, async (req, res) => {
  const { name, photo_url } = req.body;
  try {
    const { rows } = await db.query(
      'UPDATE users SET name = $1, photo_url = $2 WHERE id = $3 RETURNING name, photo_url',
      [name, photo_url, req.userId]
    );
    res.json({ message: "Perfil atualizado com sucesso", ...rows[0] });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Alterar a senha do usuário logado
router.put('/profile/change-password', auth, async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  try {
    // 1. Buscar o usuário e sua senha atual
    const { rows, rowCount } = await db.query('SELECT password FROM users WHERE id = $1', [req.userId]);
    if (rowCount === 0) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }
    const user = rows[0];

    // 2. Verificar se a senha atual está correta
    const isMatch = bcrypt.compareSync(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'A senha atual está incorreta.' });
    }

    // 3. Criptografar e salvar a nova senha
    const hash = bcrypt.hashSync(newPassword, 10);
    await db.query('UPDATE users SET password = $1 WHERE id = $2', [hash, req.userId]);

    res.json({ message: 'Senha alterada com sucesso!' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro no servidor ao alterar a senha.' });
  }
});

module.exports = router;
