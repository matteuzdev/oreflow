// backend/routes/upload.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('../config/cloudinary');
const auth = require('../middleware/auth');

// Configura o Multer para usar armazenamento em memória
const storage = multer.memoryStorage();
const upload = multer({ storage });

// A rota espera um campo de formulário chamado 'image'
router.post('/', auth, upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Nenhum arquivo foi enviado.' });
  }

  // Envia o buffer do arquivo para o Cloudinary
  // A pasta 'oreflow' será criada automaticamente no Cloudinary
  cloudinary.uploader.upload_stream({ folder: 'oreflow' }, (error, result) => {
    if (error) {
      console.error('Erro no upload para o Cloudinary:', error);
      return res.status(500).json({ error: 'Falha no upload da imagem.' });
    }
    // Retorna a URL segura da imagem
    res.status(200).json({ secure_url: result.secure_url });
  }).end(req.file.buffer);
});

module.exports = router;
