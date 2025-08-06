// backend/routes/admin.js
const express = require('express');
const router = express.Router();
const db = require('../database');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');
const bcrypt = require('bcryptjs');

router.use(auth, adminAuth);

// --- Gerenciamento de Organização ---
router.get('/organization', async (req, res) => {
  try {
    const { rows, rowCount } = await db.query('SELECT * FROM organizations WHERE id = $1', [req.organization_id]);
    if (rowCount === 0) return res.status(404).json({ msg: "Organização não encontrada" });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/organization', async (req, res) => {
  const { name, primary_color, secondary_color, logo_url } = req.body;
  try {
    const { rows, rowCount } = await db.query(
      'UPDATE organizations SET company_name = $1, theme_primary_color = $2, theme_secondary_color = $3, logo_url = $4 WHERE id = $5 RETURNING *',
      [name, primary_color, secondary_color, logo_url, req.organization_id]
    );
     if (rowCount === 0) return res.status(404).json({ msg: "Organização não encontrada" });
    res.json(rows[0]);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// --- Configurações ---
router.get('/settings', async (req, res) => {
    try {
      const { rows, rowCount } = await db.query('SELECT * FROM settings WHERE organization_id = $1', [req.organization_id]);
      if(rowCount > 0) {
        res.json(rows[0]);
      } else {
        // Se não houver, retorna um default
        res.json({ email_notifications: 0, sms_notifications: 0, alert_low_stock: 0 });
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
});

router.put('/settings', async (req, res) => {
    const { email_notifications, sms_notifications, alert_low_stock } = req.body;
    try {
        await db.query(
            `INSERT INTO settings (organization_id, email_notifications, sms_notifications, alert_low_stock)
             VALUES ($1, $2, $3, $4)
             ON CONFLICT(organization_id) DO UPDATE SET
               email_notifications = EXCLUDED.email_notifications,
               sms_notifications = EXCLUDED.sms_notifications,
               alert_low_stock = EXCLUDED.alert_low_stock`,
            [req.organization_id, email_notifications, sms_notifications, alert_low_stock]
        );
        res.json({ message: 'Configurações atualizadas com sucesso' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// --- Gerenciamento de Usuários ---
router.get('/users', async (req, res) => {
  try {
    const { rows } = await db.query('SELECT id, name, email, role, photo_url FROM users WHERE organization_id = $1', [req.organization_id]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const brevoApi = require('../config/brevo');
const crypto = require('crypto');

// ... (código anterior do arquivo) ...

// Convidar (criar) novo usuário para a organização
router.post('/users', async (req, res) => {
  const { name, email, role = 'user' } = req.body;
  
  // 1. Gerar senha temporária e token de reset
  const tempPassword = crypto.randomBytes(20).toString('hex');
  const hash = bcrypt.hashSync(tempPassword, 8);
  const token = crypto.randomBytes(20).toString('hex');
  const expires = Date.now() + 86400000; // Token válido por 24 horas

  try {
    // 2. Salvar usuário no banco de dados
    const { rows } = await db.query(
      'INSERT INTO users (name, email, password, role, organization_id, reset_password_token, reset_password_expires) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id, name, email, role',
      [name, email, hash, role, req.organization_id, token, expires]
    );
    const newUser = rows[0];

    // 3. Enviar email de convite/definição de senha via Brevo
    const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password/${token}`;
    
    await brevoApi.sendTransacEmail({
      sender: { email: 'noreply@oreflow.com', name: 'Oreflow' },
      to: [{ email: newUser.email, name: newUser.name }],
      subject: 'Você foi convidado para o Oreflow!',
      htmlContent: `
        <h1>Bem-vindo ao Oreflow!</h1>
        <p>Você foi convidado para se juntar à organização.</p>
        <p>Por favor, clique no link abaixo para definir sua senha e ativar sua conta:</p>
        <a href="${resetLink}">Definir minha senha</a>
        <p>Este link expira em 24 horas.</p>
      `,
    });

    res.status(201).json(newUser);
  } catch (err) {
    if (err.code === '23505') return res.status(400).json({ error: "Email já cadastrado" });
    console.error("Erro ao convidar usuário:", err);
    res.status(500).json({ error: "Ocorreu um erro no servidor ao convidar o usuário." });
  }
});

router.put('/users/:id', async (req, res) => {
  const { role } = req.body;
  const userIdToUpdate = req.params.id;

  if (userIdToUpdate == req.userId) {
    return res.status(403).json({ msg: "Não é possível alterar o próprio cargo." });
  }

  try {
    const { rowCount } = await db.query(
      'UPDATE users SET role = $1 WHERE id = $2 AND organization_id = $3',
      [role, userIdToUpdate, req.organization_id]
    );
    if (rowCount === 0) return res.status(404).json({ msg: "Usuário não encontrado na organização" });
    res.json({ message: "Cargo do usuário atualizado com sucesso" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete('/users/:id', async (req, res) => {
  const userIdToDelete = req.params.id;

  if (userIdToDelete == req.userId) {
    return res.status(403).json({ msg: "Não é possível remover a si mesmo." });
  }

  try {
    const { rowCount } = await db.query('DELETE FROM users WHERE id = $1 AND organization_id = $2', [userIdToDelete, req.organization_id]);
    if (rowCount === 0) return res.status(404).json({ msg: "Usuário não encontrado na organização" });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;