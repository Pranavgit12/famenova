const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';
const JWT_EXPIRES_IN = '7d';
const USERS_PATH = path.resolve('./users.json');

const DEFAULT_ADMIN = {
  id: 1,
  name: 'Admin',
  email: 'admin@rexagency.com',
  password: bcrypt.hashSync('admin123', 10),
  role: 'admin',
};

function loadUsers() {
  if (!fs.existsSync(USERS_PATH)) {
    fs.writeFileSync(USERS_PATH, JSON.stringify([DEFAULT_ADMIN], null, 2));
  }
  return JSON.parse(fs.readFileSync(USERS_PATH, 'utf-8'));
}

function saveUsers(users) {
  fs.writeFileSync(USERS_PATH, JSON.stringify(users, null, 2));
}

function generateToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
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
    const { name, email, password, role } = req.body;

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

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      id: users.length > 0 ? Math.max(...users.map((u) => u.id)) + 1 : 1,
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      role: role === 'admin' ? 'admin' : 'editor',
    };

    users.push(newUser);
    saveUsers(users);

    const token = generateToken({ id: newUser.id, email: newUser.email, role: newUser.role });

    res.status(201).json({
      success: true,
      data: {
        token,
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

    users[idx].password = await bcrypt.hash(newPassword, 10);
    saveUsers(users);

    res.json({ success: true, message: 'Password updated successfully' });
  } catch (err) {
    console.error('[AUTH] Update password error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
}

module.exports = { login, register, getProfile, updatePassword };
