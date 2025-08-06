// backend/database.js
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

const createTables = async () => {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS organizations (
        id SERIAL PRIMARY KEY,
        company_name TEXT NOT NULL,
        cnpj TEXT NOT NULL UNIQUE,
        theme_primary_color TEXT DEFAULT '#3498db',
        theme_secondary_color TEXT DEFAULT '#2ecc71',
        logo_url TEXT
      );

      CREATE TABLE IF NOT EXISTS settings (
        id SERIAL PRIMARY KEY,
        organization_id INTEGER UNIQUE,
        email_notifications INTEGER DEFAULT 0,
        sms_notifications INTEGER DEFAULT 0,
        alert_low_stock INTEGER DEFAULT 0,
        FOREIGN KEY(organization_id) REFERENCES organizations(id)
      );

      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        photo_url TEXT,
        role TEXT NOT NULL DEFAULT 'user', -- 'admin' ou 'user'
        reset_password_token TEXT,
        reset_password_expires BIGINT,
        organization_id INTEGER,
        FOREIGN KEY(organization_id) REFERENCES organizations(id)
      );

      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        unit TEXT NOT NULL,
        organization_id INTEGER,
        user_id INTEGER,
        FOREIGN KEY(organization_id) REFERENCES organizations(id),
        FOREIGN KEY(user_id) REFERENCES users(id)
      );

      CREATE TABLE IF NOT EXISTS production (
        id SERIAL PRIMARY KEY,
        product_id INTEGER,
        quantity NUMERIC NOT NULL,
        date TIMESTAMP NOT NULL,
        organization_id INTEGER,
        user_id INTEGER,
        FOREIGN KEY(product_id) REFERENCES products(id),
        FOREIGN KEY(organization_id) REFERENCES organizations(id),
        FOREIGN KEY(user_id) REFERENCES users(id)
      );

      CREATE TABLE IF NOT EXISTS clients (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        cnpj TEXT,
        email TEXT,
        phone TEXT,
        address TEXT,
        type TEXT NOT NULL, -- 'cliente' ou 'fornecedor'
        organization_id INTEGER,
        user_id INTEGER,
        FOREIGN KEY(organization_id) REFERENCES organizations(id),
        FOREIGN KEY(user_id) REFERENCES users(id),
        UNIQUE(cnpj, organization_id)
      );

      CREATE TABLE IF NOT EXISTS sales (
        id SERIAL PRIMARY KEY,
        product_id INTEGER,
        client_id INTEGER,
        quantity NUMERIC NOT NULL,
        value NUMERIC NOT NULL,
        date TIMESTAMP NOT NULL,
        type TEXT NOT NULL, -- 'venda' ou 'compra'
        organization_id INTEGER,
        user_id INTEGER,
        FOREIGN KEY(product_id) REFERENCES products(id),
        FOREIGN KEY(client_id) REFERENCES clients(id),
        FOREIGN KEY(organization_id) REFERENCES organizations(id),
        FOREIGN KEY(user_id) REFERENCES users(id)
      );

      CREATE TABLE IF NOT EXISTS notifications (
        id SERIAL PRIMARY KEY,
        organization_id INTEGER NOT NULL,
        user_id INTEGER NOT NULL, -- ID do admin que enviou
        title TEXT NOT NULL,
        message TEXT NOT NULL,
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(organization_id) REFERENCES organizations(id),
        FOREIGN KEY(user_id) REFERENCES users(id)
      );

      CREATE TABLE IF NOT EXISTS user_notification_reads (
          user_id INTEGER NOT NULL,
          notification_id INTEGER NOT NULL,
          read_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
          PRIMARY KEY (user_id, notification_id),
          FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
          FOREIGN KEY(notification_id) REFERENCES notifications(id) ON DELETE CASCADE
      );
    `);
    console.log('Tabelas verificadas/criadas com sucesso.');
  } catch (err) {
    console.error('Erro ao criar tabelas:', err.stack);
  } finally {
    client.release();
  }
};

createTables();

module.exports = {
  query: (text, params) => pool.query(text, params),
};
