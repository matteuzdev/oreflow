// backend/routes/client.js
const express = require('express');
const router = express.Router();
const db = require('../database');
const auth = require('../middleware/auth');

// Listar clientes/fornecedores da organização
router.get('/', auth, (req, res) => {
  db.all(`SELECT * FROM clients WHERE organization_id = ?`, [req.organization_id], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Criar cliente/fornecedor
router.post('/', auth, (req, res) => {
  const { name, cnpj, email, phone, address, type } = req.body;
  const query = `INSERT INTO clients (name, cnpj, email, phone, address, type, organization_id, user_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
  const params = [name, cnpj, email, phone, address, type, req.organization_id, req.userId];

  db.run(query, params, function(err) {
    if (err) {
      if (err.message.includes('UNIQUE constraint failed')) {
        return res.status(400).json({ error: 'CNPJ já cadastrado para esta organização.' });
      }
      return res.status(400).json({ error: err.message });
    }
    res.status(201).json({ id: this.lastID, ...req.body });
  });
});

// Atualizar cliente/fornecedor
router.put('/:id', auth, (req, res) => {
  const { name, cnpj, email, phone, address, type } = req.body;
  const query = `UPDATE clients SET name = ?, cnpj = ?, email = ?, phone = ?, address = ?, type = ? WHERE id = ? AND organization_id = ?`;
  const params = [name, cnpj, email, phone, address, type, req.params.id, req.organization_id];

  db.run(query, params, function(err) {
    if (err) {
      if (err.message.includes('UNIQUE constraint failed')) {
        return res.status(400).json({ error: 'CNPJ já cadastrado para esta organização.' });
      }
      return res.status(400).json({ error: err.message });
    }
    if (this.changes === 0) return res.status(404).json({ msg: "Cliente não encontrado ou não autorizado" });
    res.json({ id: req.params.id, ...req.body });
  });
});

// Deletar cliente/fornecedor
router.delete('/:id', auth, (req, res) => {
  db.run(`DELETE FROM clients WHERE id = ? AND organization_id = ?`, [req.params.id, req.organization_id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ msg: "Cliente não encontrado ou não autorizado" });
    res.status(204).send();
  });
});

module.exports = router;