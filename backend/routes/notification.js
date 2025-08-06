// backend/routes/notification.js
const express = require('express');
const router = express.Router();
const db = require('../database');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');

// Rota para o Admin criar uma notificação
router.post('/admin', auth, adminAuth, async (req, res) => {
  const { title, message } = req.body;
  if (!title || !message) {
    return res.status(400).json({ error: 'Título e mensagem são obrigatórios.' });
  }

  try {
    const { rows } = await db.query(
      'INSERT INTO notifications (organization_id, user_id, title, message) VALUES ($1, $2, $3, $4) RETURNING *',
      [req.organization_id, req.userId, title, message]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao criar notificação.' });
  }
});

// Rota para o usuário buscar suas notificações
router.get('/', auth, async (req, res) => {
  try {
    const { rows } = await db.query(`
      SELECT 
        n.id, n.title, n.message, n.created_at,
        CASE WHEN unr.read_at IS NOT NULL THEN true ELSE false END AS is_read
      FROM notifications n
      LEFT JOIN user_notification_reads unr ON n.id = unr.notification_id AND unr.user_id = $1
      WHERE n.organization_id = $2
      ORDER BY n.created_at DESC
    `, [req.userId, req.organization_id]);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar notificações.' });
  }
});

// Rota para o usuário marcar todas as notificações como lidas
router.post('/read-all', auth, async (req, res) => {
    try {
        // Pega todos os IDs de notificação para a organização que o usuário ainda não leu
        const { rows: unreadNotifications } = await db.query(`
            SELECT n.id FROM notifications n
            WHERE n.organization_id = $1 
            AND NOT EXISTS (
                SELECT 1 FROM user_notification_reads unr 
                WHERE unr.notification_id = n.id AND unr.user_id = $2
            )
        `, [req.organization_id, req.userId]);

        if (unreadNotifications.length === 0) {
            return res.status(200).json({ message: 'Nenhuma notificação nova para marcar como lida.' });
        }

        // Insere todas as notificações não lidas na tabela de leitura
        const insertPromises = unreadNotifications.map(n => {
            return db.query(
                'INSERT INTO user_notification_reads (user_id, notification_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
                [req.userId, n.id]
            );
        });

        await Promise.all(insertPromises);

        res.status(200).json({ message: 'Todas as notificações foram marcadas como lidas.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao marcar notificações como lidas.' });
    }
});


module.exports = router;
