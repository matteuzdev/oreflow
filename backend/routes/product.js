// backend/routes/product.js
const express = require('express');
const router = express.Router();
const db = require('../database');
const auth = require('../middleware/auth');

// Listar produtos da organização
router.get('/', auth, (req, res) => {
  db.all(`SELECT * FROM products WHERE organization_id = ?`, [req.organization_id], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Criar produto
router.post('/', auth, (req, res) => {
  const { name, unit } = req.body;
  db.run(`INSERT INTO products (name, unit, organization_id, user_id) VALUES (?, ?, ?, ?)`,
    [name, unit, req.organization_id, req.userId],
    function(err) {
      if (err) return res.status(400).json({ error: err.message });
      res.status(201).json({ id: this.lastID, name, unit });
    });
});

// Atualizar produto
router.put('/:id', auth, (req, res) => {
  const { name, unit } = req.body;
  db.run(`UPDATE products SET name = ?, unit = ? WHERE id = ? AND organization_id = ?`,
    [name, unit, req.params.id, req.organization_id],
    function(err) {
      if (err) return res.status(400).json({ error: err.message });
      if (this.changes === 0) return res.status(404).json({ msg: "Produto não encontrado ou não autorizado" });
      res.json({ id: req.params.id, name, unit });
    });
});

// Deletar produto
router.delete('/:id', auth, (req, res) => {
  db.run(`DELETE FROM products WHERE id = ? AND organization_id = ?`, [req.params.id, req.organization_id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ msg: "Produto não encontrado ou não autorizado" });
    res.status(204).send();
  });
});

module.exports = router;