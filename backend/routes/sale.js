// backend/routes/sale.js
const express = require('express');
const router = express.Router();
const db = require('../database');
const auth = require('../middleware/auth');

// Listar vendas/compras da organização
router.get('/', auth, async (req, res) => {
  try {
    const { rows } = await db.query(`
      SELECT sales.*, products.name AS product_name, clients.name AS client_name
      FROM sales
      JOIN products ON sales.product_id = products.id
      JOIN clients ON sales.client_id = clients.id
      WHERE sales.organization_id = $1 ORDER BY date DESC
    `, [req.organization_id]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Registrar venda/compra
router.post('/', auth, async (req, res) => {
  const { product_id, client_id, quantity, value, date, type } = req.body;
  try {
    const { rows } = await db.query(
      'INSERT INTO sales (product_id, client_id, quantity, value, date, type, organization_id, user_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
      [product_id, client_id, quantity, value, date, type, req.organization_id, req.userId]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Atualizar venda/compra
router.put('/:id', auth, async (req, res) => {
  const { product_id, client_id, quantity, value, date, type } = req.body;
  try {
    const { rows, rowCount } = await db.query(
      'UPDATE sales SET product_id = $1, client_id = $2, quantity = $3, value = $4, date = $5, type = $6 WHERE id = $7 AND organization_id = $8 RETURNING *',
      [product_id, client_id, quantity, value, date, type, req.params.id, req.organization_id]
    );
    if (rowCount === 0) return res.status(404).json({ msg: "Registro de venda/compra não encontrado ou não autorizado" });
    res.json(rows[0]);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Deletar venda/compra
router.delete('/:id', auth, async (req, res) => {
  try {
    const { rowCount } = await db.query('DELETE FROM sales WHERE id = $1 AND organization_id = $2', [req.params.id, req.organization_id]);
    if (rowCount === 0) return res.status(404).json({ msg: "Registro de venda/compra não encontrado ou não autorizado" });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
