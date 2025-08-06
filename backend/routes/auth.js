// backend/routes/auth.js
require('dotenv').config({ path: '../.env.local' }); // Carrega as variáveis de ambiente
const express = require('express');
const router = express.Router();
const db = require('../database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Cadastro de usuário e criação de organização
router.post('/register', (req, res) => {
  const { company_name, cnpj, name, email, password } = req.body;
  if (!company_name || !cnpj || !name || !email || !password) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
  }
  const hash = bcrypt.hashSync(password, 10); // Aumentando a força do hash

  db.serialize(() => {
    db.run('BEGIN TRANSACTION');

    const orgStmt = `INSERT INTO organizations (company_name, cnpj) VALUES (?, ?)`;
    db.run(orgStmt, [company_name, cnpj], function(err) {
      if (err) {
        db.run('ROLLBACK');
        // Verifica se o erro é de CNPJ duplicado
        if (err.message.includes('UNIQUE constraint failed: organizations.cnpj')) {
          return res.status(400).json({ error: 'CNPJ já cadastrado.' });
        }
        return res.status(500).json({ error: 'Erro ao criar organização.' });
      }
      
      const organization_id = this.lastID;
      const userStmt = `INSERT INTO users (name, email, password, role, organization_id) VALUES (?, ?, ?, 'admin', ?)`;
      
      db.run(userStmt, [name, email, hash, organization_id], function(err) {
        if (err) {
          db.run('ROLLBACK');
          // Verifica se o erro é de email duplicado
          if (err.message.includes('UNIQUE constraint failed: users.email')) {
            return res.status(400).json({ error: 'Email já cadastrado.' });
          }
          return res.status(500).json({ error: 'Erro ao criar usuário.' });
        }
        
        db.run('COMMIT');
        res.status(201).json({ message: 'Usuário e organização criados com sucesso!' });
      });
    });
  });
});

// Login de usuário
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  db.get(`SELECT * FROM users WHERE email = ?`, [email], (err, user) => {
    if (err) return res.status(500).json({ error: err.message });
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
  });
});

const crypto = require('crypto');

// ... (código de register e login existente) ...

// Rota para solicitar a redefinição de senha
router.post('/forgot-password', (req, res) => {
  const { email } = req.body;
  db.get(`SELECT * FROM users WHERE email = ?`, [email], (err, user) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!user) {
      // Resposta genérica para não revelar se um email existe ou não
      return res.status(200).json({ message: 'Se um usuário com este email existir, um link de redefinição foi enviado.' });
    }

    const token = crypto.randomBytes(20).toString('hex');
    const expires = Date.now() + 3600000; // 1 hora a partir de agora

    db.run(
      `UPDATE users SET reset_password_token = ?, reset_password_expires = ? WHERE id = ?`,
      [token, expires, user.id],
      (err) => {
        if (err) return res.status(500).json({ error: 'Erro ao salvar o token de redefinição.' });

        // Simulação de envio de email: Logar o link no console do backend
        console.log('--- LINK DE REDEFINIÇÃO DE SENHA (SIMULAÇÃO) ---');
        console.log(`http://localhost:5173/reset-password/${token}`);
        console.log('-------------------------------------------------');

        res.status(200).json({ message: 'Se um usuário com este email existir, um link de redefinição foi enviado.' });
      }
    );
  });
});

// Rota para redefinir a senha
router.post('/reset-password/:token', (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  db.get(
    `SELECT * FROM users WHERE reset_password_token = ? AND reset_password_expires > ?`,
    [token, Date.now()],
    (err, user) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!user) {
        return res.status(400).json({ error: 'Token de redefinição inválido ou expirado.' });
      }

      const hash = bcrypt.hashSync(password, 10);
      db.run(
        `UPDATE users SET password = ?, reset_password_token = NULL, reset_password_expires = NULL WHERE id = ?`,
        [hash, user.id],
        (err) => {
          if (err) return res.status(500).json({ error: 'Erro ao redefinir a senha.' });
          res.status(200).json({ message: 'Senha redefinida com sucesso!' });
        }
      );
    }
  );
});

module.exports = router;
