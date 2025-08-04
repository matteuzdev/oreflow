// backend/routes/sale.js
const express = require('express');
const router = express.Router();
const db = require('../database');
const auth = require('../middleware/auth');

// Listar vendas/compras da organização
router.get('/', auth, (req, res) => {
  db.all(`
    SELECT sales.*, products.name AS product_name, clients.name AS client_name
    FROM sales
    JOIN products ON sales.product_id = products.id
    JOIN clients ON sales.client_id = clients.id
    WHERE sales.organization_id = ? ORDER BY date DESC
  `, [req.organization_id], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Registrar venda/compra
router.post('/', auth, (req, res) => {
  const { product_id, client_id, quantity, value, date, type } = req.body;
  db.run(
    `INSERT INTO sales (product_id, client_id, quantity, value, date, type, organization_id, user_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [product_id, client_id, quantity, value, date, type, req.organization_id, req.userId],
    function(err) {
      if (err) return res.status(400).json({ error: err.message });
      res.status(201).json({ id: this.lastID, product_id, client_id, quantity, value, date, type });
    });
});

// Atualizar venda/compra
router.put('/:id', auth, (req, res) => {
  const { product_id, client_id, quantity, value, date, type } = req.body;
  db.run(
    `UPDATE sales SET product_id = ?, client_id = ?, quantity = ?, value = ?, date = ?, type = ? WHERE id = ? AND organization_id = ?`,
    [product_id, client_id, quantity, value, date, type, req.params.id, req.organization_id],
    function(err) {
      if (err) return res.status(400).json({ error: err.message });
      if (this.changes === 0) return res.status(404).json({ msg: "Registro de venda/compra não encontrado ou não autorizado" });
      res.json({ id: req.params.id, product_id, client_id, quantity, value, date, type });
    }
  );
});

// Deletar venda/compra
router.delete('/:id', auth, (req, res) => {
  db.run(`DELETE FROM sales WHERE id = ? AND organization_id = ?`, [req.params.id, req.organization_id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ msg: "Registro de venda/compra não encontrado ou não autorizado" });
    res.status(204).send();
  });
});

module.exports = router;