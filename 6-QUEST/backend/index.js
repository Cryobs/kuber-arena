const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));

app.use(express.json());

const pool = new Pool({
  user: 'admin',
  password: process.env.DB_PASSWORD,
  host: 'postgres',
  database: 'homelab',
  port: 5432,
});

async function initDatabase() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS test (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Database initialized - table "test" is ready');
  } catch (err) {
    console.error('❌ Database initialization failed:', err);
  }
}

initDatabase();

app.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM test ORDER BY id DESC');
    res.json({ status: 'ok', data: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.post('/add', async (req, res) => {
  const { name } = req.body;
  try {
    await pool.query('INSERT INTO test (name) VALUES ($1)', [name]);
    res.json({ status: 'added', name });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => {
  console.log('Backend running on port 3000');
});
