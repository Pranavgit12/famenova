const { Pool } = require('pg');

const { DATABASE_URL } = require('../config/env');

let pool = null;
let schemaReady = null;

function getPool() {
  if (!pool) {
    pool = new Pool({
      connectionString: DATABASE_URL,
      max: 5,
      connectionTimeoutMillis: 10000,
      idleTimeoutMillis: 0,
      allowExitOnIdle: true,
      ssl: /sslmode=disable/.test(DATABASE_URL) ? false : { rejectUnauthorized: false },
    });
    if (typeof pool.on === 'function') {
      pool.on('error', (err) => {
        console.error('[PG] Unexpected pool error:', err.message);
      });
    }
  }
  return pool;
}

async function ensureSchema() {
  if (schemaReady) return schemaReady;
  schemaReady = getPool()
    .query(`
      CREATE TABLE IF NOT EXISTS leads (
        id SERIAL PRIMARY KEY,
        full_name TEXT NOT NULL,
        phone TEXT NOT NULL,
        location TEXT NOT NULL,
        business_name TEXT NOT NULL,
        niche TEXT,
        status TEXT NOT NULL DEFAULT 'new',
        notes TEXT NOT NULL DEFAULT '',
        submitted_at TEXT
      );

      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'editor',
        created_at TIMESTAMPTZ NOT NULL DEFAULT now()
      );
    `)
    .then(() => {
      console.log('[PG] Schema ready');
    })
    .catch((err) => {
      schemaReady = null;
      throw err;
    });
  return schemaReady;
}

function query(text, params) {
  return getPool().query(text, params);
}

module.exports = { getPool, ensureSchema, query };
