require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');

const routes = require('./routes');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false,
}));
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

const frontendDist = path.join(__dirname, '..', 'frontend', 'dist');
const adminDist = path.join(__dirname, '..', 'admin-dashboard', 'dist');

app.use(express.static(frontendDist));
app.use('/admin', express.static(adminDist));

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
  if (req.path.startsWith('/admin')) return res.sendFile(path.join(adminDist, 'index.html'));
  res.sendFile(path.join(frontendDist, 'index.html'));
});

app.use('/api/*', (_req, res) => {
  res.status(404).json({ success: false, message: 'API endpoint not found' });
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`[SERVER] REX Agency running on http://localhost:${PORT}`);
  console.log('[SERVER] Database: Excel + JSON file storage');
});

module.exports = app;
