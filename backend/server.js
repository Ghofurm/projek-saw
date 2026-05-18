const express = require('express');
const cors = require('cors');
require('dotenv').config();

const apiRouter = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes Mounting
app.use('/api', apiRouter);

// Root Welcome Endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to SPK SAW Neobrutalism REST API Backend!',
    version: '1.0.0',
    endpoints: {
      criteria: '/api/criteria',
      alternatives: '/api/alternatives',
      scores: '/api/scores',
      reset: '/api/reset (POST)'
    }
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('💥 Internal Server Error:', err.stack);
  res.status(500).json({ error: 'Terjadi kesalahan sistem internal pada server.' });
});

// Jalankan Server
app.listen(PORT, () => {
  console.log(`🚀 SPK SAW Backend Server is running at http://localhost:${PORT}`);
});
