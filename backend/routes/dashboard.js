// backend/routes/dashboard.js
const express = require('express');
const router = express.Router();
const db = require('../database');
const auth = require('../middleware/auth');

router.get('/summary', auth, async (req, res) => {
  try {
    const { organization_id } = req;

    // KPI 1: Produção total do mês atual
    const productionQuery = `
      SELECT COALESCE(SUM(quantity), 0) as total
      FROM production
      WHERE organization_id = $1 AND date_trunc('month', date) = date_trunc('month', current_date)
    `;
    const productionResult = await db.query(productionQuery, [organization_id]);
    
    // KPI 2: Vendas totais do mês atual
    const salesQuery = `
      SELECT COALESCE(SUM(value), 0) as total
      FROM sales
      WHERE organization_id = $1 AND type = 'venda' AND date_trunc('month', date) = date_trunc('month', current_date)
    `;
    const salesResult = await db.query(salesQuery, [organization_id]);

    // KPI 3: Contagem total de clientes
    const clientsQuery = `
      SELECT COUNT(*) as total
      FROM clients
      WHERE organization_id = $1 AND type = 'cliente'
    `;
    const clientsResult = await db.query(clientsQuery, [organization_id]);

    // Dados para o gráfico: Vendas dos últimos 6 meses
    const chartQuery = `
      SELECT 
        to_char(date_trunc('month', "date"), 'YYYY-MM') AS month,
        SUM(value) as total_sales
      FROM sales
      WHERE organization_id = $1 AND type = 'venda' AND "date" > date_trunc('month', current_date) - interval '6 months'
      GROUP BY month
      ORDER BY month;
    `;
    const chartResult = await db.query(chartQuery, [organization_id]);

    res.json({
      production_total: parseFloat(productionResult.rows[0].total),
      sales_total: parseFloat(salesResult.rows[0].total),
      clients_total: parseInt(clientsResult.rows[0].total, 10),
      sales_chart_data: chartResult.rows
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar dados do dashboard.' });
  }
});

module.exports = router;
