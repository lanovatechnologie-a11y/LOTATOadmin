const express = require('express');
const cors = require('cors');
const path = require('path');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// Connexion PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// === ROUTES POUR LES PAGES ===

// Route principale : redirige vers l'application de jeu
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Route pour le centre de contrôle
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/composition 2.html'));
});

// Route alternative pour le centre de contrôle
app.get('/control', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/composition 2.html'));
});

// === API ROUTES ===

// Vérification santé
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', time: new Date() });
});

// Connexion
app.post('/api/login', async (req, res) => {
  const { code, device_id, type } = req.body;
  
  // Codes par défaut
  const defaultCodes = {
    admin: ["ADMIN123", "CONTROL456", "MASTER789"],
    agent: ["123456", "admin123", "lottery2024"]
  };
  
  // Vérification simple
  if (defaultCodes[type] && defaultCodes[type].includes(code)) {
    res.json({ success: true, code, type });
  } else {
    res.status(401).json({ error: "Code invalide" });
  }
});

// Terminaux
app.get('/api/terminals', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM terminals');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Tickets
app.post('/api/tickets', async (req, res) => {
  try {
    const { ticket_number, device_id, bets, total } = req.body;
    
    const result = await pool.query(
      `INSERT INTO tickets (ticket_number, device_id, bets, total) 
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [ticket_number, device_id, JSON.stringify(bets), total]
    );
    
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Codes d'accès
app.post('/api/codes/generate', async (req, res) => {
  const { count, type } = req.body;
  const codes = [];
  
  for (let i = 0; i < count; i++) {
    const code = type === 'admin' ? 
      `ADM${Math.random().toString(36).substr(2, 6).toUpperCase()}` :
      `AGT${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
    
    codes.push(code);
    
    await pool.query(
      'INSERT INTO access_codes (code, type) VALUES ($1, $2)',
      [code, type]
    );
  }
  
  res.json({ codes });
});

// Démarrage
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur Nova Lotto sur le port ${PORT}`);
  console.log(`- Jeu: http://localhost:${PORT}`);
  console.log(`- Admin: http://localhost:${PORT}/admin`);
});