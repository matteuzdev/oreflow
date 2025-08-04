// backend/routes/admin.js
const express = require('express');
const router = express.Router();
const db = require('../database');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');
const bcrypt = require('bcryptjs');

// Middleware para todas as rotas de admin
router.use(auth, adminAuth);

// --- Gerenciamento de Organização ---

// Obter dados da organização
router.get('/organization', (req, res) => {
  db.get(`SELECT * FROM organizations WHERE id = ?`, [req.organization_id], (err, org) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!org) return res.status(404).json({ msg: "Organização não encontrada" });
    res.json(org);
  });
});

// Atualizar dados da organização
router.put('/organization', (req, res) => {
  const { company_name, theme_primary_color, theme_secondary_color, logo_url } = req.body;
  db.run(
    `UPDATE organizations SET company_name = ?, theme_primary_color = ?, theme_secondary_color = ?, logo_url = ? WHERE id = ?`,
    [company_name, theme_primary_color, theme_secondary_color, logo_url, req.organization_id],
    function(err) {
      if (err) return res.status(400).json({ error: err.message });
      res.json({ message: "Organização atualizada com sucesso" });
    }
  );
});

// --- Gerenciamento de Usuários ---

// Listar usuários da organização
router.get('/users', (req, res) => {
  db.all(`SELECT id, name, email, role, photo_url FROM users WHERE organization_id = ?`, [req.organization_id], (err, users) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(users);
  });
});

// Convidar (criar) novo usuário para a organização
router.post('/users', (req, res) => {
  const { name, email, password, role = 'user' } = req.body;
  const hash = bcrypt.hashSync(password, 8);
  db.run(
    `INSERT INTO users (name, email, password, role, organization_id) VALUES (?, ?, ?, ?, ?)`,
    [name, email, hash, role, req.organization_id],
    function(err) {
      if (err) return res.status(400).json({ error: "Email já cadastrado" });
      res.status(201).json({ id: this.lastID, name, email, role });
    }
  );
});

// Atualizar role de um usuário
router.put('/users/:id', (req, res) => {
  const { role } = req.body;
  const userIdToUpdate = req.params.id;

  // Impede que o admin se auto-rebaixe
  if (userIdToUpdate == req.userId) {
    return res.status(403).json({ msg: "Não é possível alterar o próprio cargo." });
  }

  db.run(
    `UPDATE users SET role = ? WHERE id = ? AND organization_id = ?`,
    [role, userIdToUpdate, req.organization_id],
    function(err) {
      if (err) return res.status(400).json({ error: err.message });
      if (this.changes === 0) return res.status(404).json({ msg: "Usuário não encontrado na organização" });
      res.json({ message: "Cargo do usuário atualizado com sucesso" });
    }
  );
});

// Remover usuário da organização
router.delete('/users/:id', (req, res) => {
  const userIdToDelete = req.params.id;

  // Impede que o admin se auto-delete
  if (userIdToDelete == req.userId) {
    return res.status(403).json({ msg: "Não é possível remover a si mesmo." });
  }

  db.run(
    `DELETE FROM users WHERE id = ? AND organization_id = ?`,
    [userIdToDelete, req.organization_id],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      if (this.changes === 0) return res.status(404).json({ msg: "Usuário não encontrado na organização" });
      res.status(204).send();
    }
  );
});

module.exports = router;
