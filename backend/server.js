require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const rateLimit = require('express-rate-limit');

const { NODE_ENV, IS_PRODUCTION, PORT, CORS_ORIGINS } = require('./config/env');
const routes = require('./routes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.disable('x-powered-by');
app.set('trust proxy', IS_PRODUCTION ? 1 : 0);

app.use(
  helmet({
    contentSecurityPolicy: {
      useDefaults: false,
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", 'https://assets.calendly.com'],
        styleSrc: ["'self'", 'https://fonts.googleapis.com', "'unsafe-inline'"],
        fontSrc: ["'self'", 'https://fonts.gstatic.com', 'data:'],
        imgSrc: ["'self'", 'data:', 'blob:'],
        connectSrc: ["'self'", 'https://assets.calendly.com', 'https://calendly.com', 'https://api.calendly.com'],
        frameSrc: ['https://calendly.com'],
        objectSrc: ["'none'"],
        baseUri: ["'self'"],
        formAction: ["'self'"],
        frameAncestors: ["'none'"],
        upgradeInsecureRequests: null,
      },
    },
    crossOriginEmbedderPolicy: false,
  })
);

app.use(morgan(IS_PRODUCTION ? 'combined' : 'dev'));

if (CORS_ORIGINS.length > 0) {
  app.use(
    cors({
      origin(origin, callback) {
        if (!origin || CORS_ORIGINS.includes(origin)) {
          return callback(null, true);
        }
        return callback(new Error('Not allowed by CORS'));
      },
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      maxAge: 86400,
    })
  );
} else {
  app.use(cors({ origin: true }));
}

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests, please try again later.' },
});

app.use(globalLimiter);

app.use(express.json({ limit: '100kb' }));
app.use(express.urlencoded({ extended: true, limit: '100kb' }));

const frontendDist = path.join(__dirname, '..', 'frontend', 'dist');
const adminDist = path.join(__dirname, '..', 'admin-dashboard', 'dist');
const fs = require('fs');

const staticOptions = { maxAge: '7d', dotfiles: 'ignore', setHeaders: (res) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Cache-Control', 'public, max-age=604800');
}};

if (fs.existsSync(frontendDist)) {
  app.use(express.static(frontendDist, staticOptions));
}
if (fs.existsSync(adminDist)) {
  app.use('/admin', express.static(adminDist, staticOptions));
}

app.get('/api/health', (_req, res) => {
  res.json({
    success: true,
    data: {
      status: 'ok',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    },
  });
});

app.use('/api', routes);

app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) return next();
  if (req.path.startsWith('/admin') && fs.existsSync(adminDist)) {
    return res.sendFile(path.join(adminDist, 'index.html'));
  }
  if (fs.existsSync(frontendDist)) {
    return res.sendFile(path.join(frontendDist, 'index.html'));
  }
  res.status(404).json({ success: false, message: 'Not found' });
});

app.use('/api/*', (_req, res) => {
  res.status(404).json({ success: false, message: 'API endpoint not found' });
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`[SERVER] REX Agency running on http://localhost:${PORT} (${NODE_ENV})`);
  console.log('[SERVER] Database: Excel + JSON file storage');
});

module.exports = app;
