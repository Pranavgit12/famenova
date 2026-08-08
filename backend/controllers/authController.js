const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { JWT_SECRET, JWT_EXPIRES_IN, IS_PRODUCTION, ADMIN_EMAIL, ADMIN_PASSWORD } = require('../config/env');
const usersService = require('../services/users');

function generateToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN, issuer: 'rex-agency' });
}

async function ensureAdminSeeded() {
  const existing = await usersService.findByEmail(String(ADMIN_EMAIL || 'admin@rexagency.com').toLowerCase().trim());

  if (existing) return;

  const email = String(ADMIN_EMAIL || 'admin@rexagency.com').toLowerCase().trim();
  const password = ADMIN_PASSWORD;

  if (!password && IS_PRODUCTION) {
    throw new Error(
      '[AUTH] ADMIN_PASSWORD environment variable is required on first boot in production.'
    );
  }

  const finalPassword = password || cryptoRandom();
  const hashed = await bcrypt.hash(finalPassword, 12);

  await usersService.createUser({
    name: 'Admin',
    email,
    password: hashed,
    role: 'admin',
  });

  if (!password) {
    console.log(`[AUTH] Generated admin credentials -> ${email} / ${finalPassword}`);
  } else {
    console.log(`[AUTH] Seeded initial admin account -> ${email}`);
  }
}

function cryptoRandom() {
  return require('crypto').randomBytes(9).toString('hex');
}

function publicUser(user) {
  return { id: user.id, name: user.name, email: user.email, role: user.role };
}

async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    await ensureAdminSeeded();

    const user = await usersService.findByEmail(email);

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
        user: publicUser(user),
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

    await ensureAdminSeeded();

    const existing = await usersService.findByEmail(email);
    if (existing) {
      return res.status(409).json({ success: false, message: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = await usersService.createUser({
      name,
      email,
      password: hashedPassword,
      role: 'editor',
    });

    res.status(201).json({
      success: true,
      data: {
        user: publicUser(newUser),
      },
    });
  } catch (err) {
    console.error('[AUTH] Register error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
}

async function getProfile(req, res) {
  try {
    const user = await usersService.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({
      success: true,
      data: { user: publicUser(user) },
    });
  } catch (err) {
    console.error('[AUTH] Profile error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
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

    const user = await usersService.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Current password is incorrect' });
    }

    await usersService.updatePassword(user.id, await bcrypt.hash(newPassword, 12));

    res.json({ success: true, message: 'Password updated successfully' });
  } catch (err) {
    console.error('[AUTH] Update password error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
}

module.exports = { login, register, getProfile, updatePassword, ensureAdminSeeded };
