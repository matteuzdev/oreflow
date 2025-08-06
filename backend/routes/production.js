// backend/routes/production.js
const express = require('express');
const router = express.Router();
const db = require('../database');
const auth = require('../middleware/auth');

// Listar produção da organização
router.get('/', auth, async (req, res) => {
  try {
    const { rows } = await db.query(`
      SELECT production.*, products.name AS product_name, products.unit 
      FROM production 
      JOIN products ON production.product_id = products.id 
      WHERE production.organization_id = $1 ORDER BY date DESC
    `, [req.organization_id]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Registrar produção
router.post('/', auth, async (req, res) => {
  const { product_id, quantity, date } = req.body;
  try {
    const { rows } = await db.query(
      'INSERT INTO production (product_id, quantity, date, organization_id, user_id) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [product_id, quantity, date, req.organization_id, req.userId]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Atualizar produção
router.put('/:id', auth, async (req, res) => {
  const { product_id, quantity, date } = req.body;
  try {
    const { rows, rowCount } = await db.query(
      'UPDATE production SET product_id = $1, quantity = $2, date = $3 WHERE id = $4 AND organization_id = $5 RETURNING *',
      [product_id, quantity, date, req.params.id, req.organization_id]
    );
    if (rowCount === 0) return res.status(404).json({ msg: "Registro de produção não encontrado ou não autorizado" });
    res.json(rows[0]);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Deletar produção
router.delete('/:id', auth, async (req, res) => {
  try {
    const { rowCount } = await db.query('DELETE FROM production WHERE id = $1 AND organization_id = $2', [req.params.id, req.organization_id]);
    if (rowCount === 0) return res.status(404).json({ msg: "Registro de produção não encontrado ou não autorizado" });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
