const { ensureSchema, query } = require('./pg');

function rowToUser(row) {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    password: row.password,
    role: row.role,
  };
}

async function count() {
  await ensureSchema();
  const { rows } = await query('SELECT COUNT(*)::int AS count FROM users');
  return rows[0].count;
}

async function listUsers() {
  await ensureSchema();
  const { rows } = await query('SELECT * FROM users ORDER BY id ASC');
  return rows.map(rowToUser);
}

async function findById(id) {
  await ensureSchema();
  const { rows } = await query('SELECT * FROM users WHERE id = $1', [id]);
  return rows.length ? rowToUser(rows[0]) : null;
}

async function findByEmail(email) {
  await ensureSchema();
  const { rows } = await query('SELECT * FROM users WHERE email = $1', [String(email).toLowerCase()]);
  return rows.length ? rowToUser(rows[0]) : null;
}

async function createUser({ name, email, password, role }) {
  await ensureSchema();
  const { rows } = await query(
    `INSERT INTO users (name, email, password, role)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [String(name).trim(), String(email).toLowerCase().trim(), password, role || 'editor']
  );
  return rowToUser(rows[0]);
}

async function updatePassword(id, password) {
  await ensureSchema();
  const { rowCount } = await query('UPDATE users SET password = $1 WHERE id = $2', [password, id]);
  return rowCount > 0;
}

module.exports = { count, listUsers, findById, findByEmail, createUser, updatePassword };
