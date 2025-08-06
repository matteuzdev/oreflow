// backend/routes/client.js
const express = require('express');
const router = express.Router();
const db = require('../database');
const auth = require('../middleware/auth');

// Listar clientes/fornecedores da organização
router.get('/', auth, async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM clients WHERE organization_id = $1', [req.organization_id]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Criar cliente/fornecedor
router.post('/', auth, async (req, res) => {
  const { name, email, phone, address, type } = req.body;
  const cnpj = req.body.cnpj || null; // Garante que CNPJ vazio seja salvo como NULL
  const query = 'INSERT INTO clients (name, cnpj, email, phone, address, type, organization_id, user_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *';
  const params = [name, cnpj, email, phone, address, type, req.organization_id, req.userId];

  try {
    const { rows } = await db.query(query, params);
    res.status(201).json(rows[0]);
  } catch (err) {
    if (err.code === '23505') { // UNIQUE constraint violation
      return res.status(400).json({ error: 'CNPJ já cadastrado para esta organização.' });
    }
    res.status(400).json({ error: err.message });
  }
});

// Atualizar cliente/fornecedor
router.put('/:id', auth, async (req, res) => {
  const { name, email, phone, address, type } = req.body;
  const cnpj = req.body.cnpj || null; // Garante que CNPJ vazio seja salvo como NULL
  const query = 'UPDATE clients SET name = $1, cnpj = $2, email = $3, phone = $4, address = $5, type = $6 WHERE id = $7 AND organization_id = $8 RETURNING *';
  const params = [name, cnpj, email, phone, address, type, req.params.id, req.organization_id];

  try {
    const { rows, rowCount } = await db.query(query, params);
    if (rowCount === 0) return res.status(404).json({ msg: "Cliente não encontrado ou não autorizado" });
    res.json(rows[0]);
  } catch (err) {
    if (err.code === '23505') { // UNIQUE constraint violation
      return res.status(400).json({ error: 'CNPJ já cadastrado para esta organização.' });
    }
    res.status(400).json({ error: err.message });
  }
});

// Deletar cliente/fornecedor
router.delete('/:id', auth, async (req, res) => {
  try {
    const { rowCount } = await db.query('DELETE FROM clients WHERE id = $1 AND organization_id = $2', [req.params.id, req.organization_id]);
    if (rowCount === 0) return res.status(404).json({ msg: "Cliente não encontrado ou não autorizado" });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
