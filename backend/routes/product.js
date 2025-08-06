// backend/routes/product.js
const express = require('express');
const router = express.Router();
const db = require('../database');
const auth = require('../middleware/auth');

// Listar produtos da organização
router.get('/', auth, async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM products WHERE organization_id = $1', [req.organization_id]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Criar produto
router.post('/', auth, async (req, res) => {
  const { name, unit } = req.body;
  try {
    const { rows } = await db.query(
      'INSERT INTO products (name, unit, organization_id, user_id) VALUES ($1, $2, $3, $4) RETURNING id, name, unit',
      [name, unit, req.organization_id, req.userId]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Atualizar produto
router.put('/:id', auth, async (req, res) => {
  const { name, unit } = req.body;
  try {
    const { rows, rowCount } = await db.query(
      'UPDATE products SET name = $1, unit = $2 WHERE id = $3 AND organization_id = $4 RETURNING id, name, unit',
      [name, unit, req.params.id, req.organization_id]
    );
    if (rowCount === 0) return res.status(404).json({ msg: "Produto não encontrado ou não autorizado" });
    res.json(rows[0]);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Deletar produto
router.delete('/:id', auth, async (req, res) => {
  try {
    const { rowCount } = await db.query('DELETE FROM products WHERE id = $1 AND organization_id = $2', [req.params.id, req.organization_id]);
    if (rowCount === 0) return res.status(404).json({ msg: "Produto não encontrado ou não autorizado" });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
