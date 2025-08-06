// backend/routes/production.js
const express = require('express');
const router = express.Router();
const db = require('../database');
const auth = require('../middleware/auth');

// Listar produção da organização
router.get('/', auth, (req, res) => {
  db.all(`
    SELECT production.*, products.name AS product_name, products.unit 
    FROM production 
    JOIN products ON production.product_id = products.id 
    WHERE production.organization_id = ? ORDER BY date DESC
  `, [req.organization_id], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Registrar produção
router.post('/', auth, (req, res) => {
  const { product_id, quantity, date } = req.body;
  db.run(`INSERT INTO production (product_id, quantity, date, organization_id, user_id) VALUES (?, ?, ?, ?, ?)`,
    [product_id, quantity, date, req.organization_id, req.userId],
    function(err) {
      if (err) return res.status(400).json({ error: err.message });
      res.status(201).json({ id: this.lastID, product_id, quantity, date });
    });
});

// Atualizar produção
router.put('/:id', auth, (req, res) => {
  const { product_id, quantity, date } = req.body;
  db.run(`UPDATE production SET product_id = ?, quantity = ?, date = ? WHERE id = ? AND organization_id = ?`,
    [product_id, quantity, date, req.params.id, req.organization_id],
    function(err) {
      if (err) return res.status(400).json({ error: err.message });
      if (this.changes === 0) return res.status(404).json({ msg: "Registro de produção não encontrado ou não autorizado" });
      res.json({ id: req.params.id, product_id, quantity, date });
    });
});

// Deletar produção
router.delete('/:id', auth, (req, res) => {
  db.run(`DELETE FROM production WHERE id = ? AND organization_id = ?`, [req.params.id, req.organization_id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ msg: "Registro de produção não encontrado ou não autorizado" });
    res.status(204).send();
  });
});

module.exports = router;