// backend/database.js
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./mvp.db');

db.serialize(() => {
  // Tabela de organizações (para o sistema white-label)
  db.run(`CREATE TABLE IF NOT EXISTS organizations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    company_name TEXT NOT NULL,
    cnpj TEXT NOT NULL UNIQUE,
    theme_primary_color TEXT DEFAULT '#3498db',
    theme_secondary_color TEXT DEFAULT '#2ecc71',
    logo_url TEXT
  )`);

  // Tabela de configurações gerais da organização
  db.run(`CREATE TABLE IF NOT EXISTS settings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    organization_id INTEGER UNIQUE,
    email_notifications INTEGER DEFAULT 0,
    sms_notifications INTEGER DEFAULT 0,
    alert_low_stock INTEGER DEFAULT 0,
    FOREIGN KEY(organization_id) REFERENCES organizations(id)
  )`);

  // Tabela de usuários
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    photo_url TEXT,
    role TEXT NOT NULL DEFAULT 'user', -- 'admin' ou 'user'
    reset_password_token TEXT,
    reset_password_expires INTEGER,
    organization_id INTEGER,
    FOREIGN KEY(organization_id) REFERENCES organizations(id)
  )`);

  // Tabela de produtos
  db.run(`CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    unit TEXT NOT NULL,
    organization_id INTEGER,
    user_id INTEGER,
    FOREIGN KEY(organization_id) REFERENCES organizations(id),
    FOREIGN KEY(user_id) REFERENCES users(id)
  )`);

  // Tabela de produção
  db.run(`CREATE TABLE IF NOT EXISTS production (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id INTEGER,
    quantity REAL NOT NULL,
    date TEXT NOT NULL,
    organization_id INTEGER,
    user_id INTEGER,
    FOREIGN KEY(product_id) REFERENCES products(id),
    FOREIGN KEY(organization_id) REFERENCES organizations(id),
    FOREIGN KEY(user_id) REFERENCES users(id)
  )`);

  // Tabela de clientes/fornecedores
  db.run(`CREATE TABLE IF NOT EXISTS clients (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
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
  )`);

  // Tabela de vendas/compras
  db.run(`CREATE TABLE IF NOT EXISTS sales (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id INTEGER,
    client_id INTEGER,
    quantity REAL NOT NULL,
    value REAL NOT NULL,
    date TEXT NOT NULL,
    type TEXT NOT NULL, -- 'venda' ou 'compra'
    organization_id INTEGER,
    user_id INTEGER,
    FOREIGN KEY(product_id) REFERENCES products(id),
    FOREIGN KEY(client_id) REFERENCES clients(id),
    FOREIGN KEY(organization_id) REFERENCES organizations(id),
    FOREIGN KEY(user_id) REFERENCES users(id)
  )`);
});

module.exports = db;