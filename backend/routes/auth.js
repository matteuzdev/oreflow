// backend/routes/auth.js
require('dotenv').config({ path: '../.env.local' });
const express = require('express');
const router = express.Router();
const db = require('../database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

// Cadastro de usuário e criação de organização
router.post('/register', async (req, res) => {
  const { company_name, cnpj, name, email, password } = req.body;
  if (!company_name || !cnpj || !name || !email || !password) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
  }
  const hash = bcrypt.hashSync(password, 10);

  const client = await db.query('BEGIN');

  try {
    const orgQuery = 'INSERT INTO organizations (company_name, cnpj) VALUES ($1, $2) RETURNING id';
    const orgResult = await db.query(orgQuery, [company_name, cnpj]);
    const organization_id = orgResult.rows[0].id;

    const userQuery = `INSERT INTO users (name, email, password, role, organization_id) VALUES ($1, $2, $3, 'admin', $4)`;
    await db.query(userQuery, [name, email, hash, organization_id]);

    await db.query('COMMIT');
    res.status(201).json({ message: 'Usuário e organização criados com sucesso!' });
  } catch (err) {
    await db.query('ROLLBACK');
    if (err.code === '23505') { // unique_violation
      if (err.constraint === 'organizations_cnpj_key') {
        return res.status(400).json({ error: 'CNPJ já cadastrado.' });
      }
      if (err.constraint === 'users_email_key') {
        return res.status(400).json({ error: 'Email já cadastrado.' });
      }
    }
    res.status(500).json({ error: 'Erro ao criar organização ou usuário.', details: err.message });
  }
});

// Login de usuário
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const { rows } = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = rows[0];

    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ error: 'Email ou senha inválidos' });
    }

    const payload = {
      userId: user.id,
      organization_id: user.organization_id,
      role: user.role
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        photo_url: user.photo_url
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Rota para solicitar a redefinição de senha
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  try {
    const { rows } = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = rows[0];

    if (!user) {
      return res.status(200).json({ message: 'Se um usuário com este email existir, um link de redefinição foi enviado.' });
    }

    const token = crypto.randomBytes(20).toString('hex');
    const expires = Date.now() + 3600000; // 1 hora

    await db.query(
      'UPDATE users SET reset_password_token = $1, reset_password_expires = $2 WHERE id = $3',
      [token, expires, user.id]
    );

    console.log('--- LINK DE REDEFINIÇÃO DE SENHA (SIMULAÇÃO) ---');
    console.log(`http://localhost:5173/reset-password/${token}`);
    console.log('-------------------------------------------------');

    res.status(200).json({ message: 'Se um usuário com este email existir, um link de redefinição foi enviado.' });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao processar a solicitação.' });
  }
});

// Rota para redefinir a senha
router.post('/reset-password/:token', async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const { rows, rowCount } = await db.query(
      'SELECT * FROM users WHERE reset_password_token = $1 AND reset_password_expires > $2',
      [token, Date.now()]
    );

    if (rowCount === 0) {
      return res.status(400).json({ error: 'Token de redefinição inválido ou expirado.' });
    }
    const user = rows[0];
    const hash = bcrypt.hashSync(password, 10);

    await db.query(
      'UPDATE users SET password = $1, reset_password_token = NULL, reset_password_expires = NULL WHERE id = $2',
      [hash, user.id]
    );

    res.status(200).json({ message: 'Senha redefinida com sucesso!' });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao redefinir a senha.' });
  }
});

module.exports = router;