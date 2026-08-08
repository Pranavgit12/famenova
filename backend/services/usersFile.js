const fs = require('fs');
const path = require('path');

const USERS_PATH = path.resolve(__dirname, '..', 'users.json');
const USERS_TMP_PATH = `${USERS_PATH}.tmp`;

function readFile() {
  if (!fs.existsSync(USERS_PATH)) return [];
  return JSON.parse(fs.readFileSync(USERS_PATH, 'utf-8'));
}

function writeFile(users) {
  fs.writeFileSync(USERS_TMP_PATH, JSON.stringify(users, null, 2));
  fs.renameSync(USERS_TMP_PATH, USERS_PATH);
}

async function count() {
  try {
    return readFile().length;
  } catch (err) {
    return 0;
  }
}

async function listUsers() {
  return readFile();
}

async function findById(id) {
  const users = readFile();
  return users.find((u) => String(u.id) === String(id)) || null;
}

async function findByEmail(email) {
  const users = readFile();
  return users.find((u) => u.email === String(email).toLowerCase()) || null;
}

async function createUser({ name, email, password, role }) {
  const users = readFile();
  const nextId = users.length > 0 ? Math.max(...users.map((u) => u.id)) + 1 : 1;
  const user = {
    id: nextId,
    name: String(name).trim(),
    email: String(email).toLowerCase().trim(),
    password,
    role: role || 'editor',
  };
  users.push(user);
  writeFile(users);
  return user;
}

async function updatePassword(id, password) {
  const users = readFile();
  const idx = users.findIndex((u) => String(u.id) === String(id));
  if (idx === -1) return false;
  users[idx].password = password;
  writeFile(users);
  return true;
}

module.exports = { count, listUsers, findById, findByEmail, createUser, updatePassword };
