const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { JWT_SECRET, JWT_EXPIRES_IN, IS_PRODUCTION, ADMIN_EMAIL, ADMIN_PASSWORD } = require('../config/env');

const USERS_PATH = path.resolve(__dirname, '..', 'users.json');
const USERS_TMP_PATH = `${USERS_PATH}.tmp`;

function loadUsers() {
  if (!fs.existsSync(USERS_PATH)) {
    throw new Error('users.json not found. Run ensureAdminSeeded() at startup.');
  }
  return JSON.parse(fs.readFileSync(USERS_PATH, 'utf-8'));
}

function saveUsers(users) {
  const tmpPath = USERS_TMP_PATH;
  fs.writeFileSync(tmpPath, JSON.stringify(users, null, 2));
  fs.renameSync(tmpPath, USERS_PATH);
}

function ensureAdminSeeded() {
  if (fs.existsSync(USERS_PATH)) return;

  const email = String(ADMIN_EMAIL || 'admin@rexagency.com').toLowerCase().trim();
  const password = ADMIN_PASSWORD;

  if (!password && IS_PRODUCTION) {
    throw new Error(
      '[AUTH] ADMIN_PASSWORD environment variable is required on first boot in production.'
    );
  }

  const finalPassword = password || crypto.randomBytes(9).toString('hex');

  const admin = {
    id: 1,
    name: 'Admin',
    email,
    password: bcrypt.hashSync(finalPassword, 12),
    role: 'admin',
  };

  saveUsers([admin]);

  if (!password) {
    console.log(`[AUTH] Generated admin credentials -> ${email} / ${finalPassword}`);
  } else {
    console.log(`[AUTH] Seeded initial admin account -> ${email}`);
  }
}

function generateToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN, issuer: 'rex-agency' });
}

async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    const users = loadUsers();
    const user = users.find((u) => u.email === email.toLowerCase());

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const token = generateToken({ id: user.id, email: user.email, role: user.role });

    res.json({
      success: true,
      data: {
        token,
        user: { id: user.id, name: user.name, email: user.email, role: user.role },
      },
    });
  } catch (err) {
    console.error('[AUTH] Login error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
}

async function register(req, res) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email, and password are required' });
    }

    if (password.length < 8) {
      return res.status(400).json({ success: false, message: 'Password must be at least 8 characters' });
    }

    const users = loadUsers();
    const existing = users.find((u) => u.email === email.toLowerCase());
    if (existing) {
      return res.status(409).json({ success: false, message: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = {
      id: users.length > 0 ? Math.max(...users.map((u) => u.id)) + 1 : 1,
      name: String(name).trim(),
      email: String(email).toLowerCase().trim(),
      password: hashedPassword,
      role: 'editor',
    };

    users.push(newUser);
    saveUsers(users);

    res.status(201).json({
      success: true,
      data: {
        user: { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role },
      },
    });
  } catch (err) {
    console.error('[AUTH] Register error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
}

function getProfile(req, res) {
  const users = loadUsers();
  const user = users.find((u) => String(u.id) === String(req.user.id));

  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }

  res.json({
    success: true,
    data: { user: { id: user.id, name: user.name, email: user.email, role: user.role } },
  });
}

async function updatePassword(req, res) {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'Current password and new password are required' });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ success: false, message: 'New password must be at least 8 characters' });
    }

    const users = loadUsers();
    const idx = users.findIndex((u) => String(u.id) === String(req.user.id));

    if (idx === -1) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(currentPassword, users[idx].password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Current password is incorrect' });
    }

    users[idx].password = await bcrypt.hash(newPassword, 12);
    saveUsers(users);

    res.json({ success: true, message: 'Password updated successfully' });
  } catch (err) {
    console.error('[AUTH] Update password error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
}

module.exports = { login, register, getProfile, updatePassword, ensureAdminSeeded };
