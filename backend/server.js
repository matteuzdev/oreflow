// backend/server.js
require('dotenv').config({ path: '.env.local' });
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Importar rotas
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/user')); // Rota para perfil de usuário
app.use('/api/admin', require('./routes/admin')); // Rotas administrativas
app.use('/api/products', require('./routes/product'));
app.use('/api/production', require('./routes/production'));
app.use('/api/clients', require('./routes/client'));
app.use('/api/sales', require('./routes/sale'));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));