const path = require('path');

require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });
if (!process.env.JWT_SECRET) {
  require('dotenv').config({ path: path.resolve(__dirname, '..', '..', '.env') });
}

const NODE_ENV = process.env.NODE_ENV || 'development';
const IS_PRODUCTION = NODE_ENV === 'production';

const WEAK_JWT_SECRETS = [
  '',
  'dev-secret-change-me',
  'your-jwt-secret-change-in-production',
  'change-this-in-production',
  'change-me-to-a-strong-random-string',
  'replace-me-with-a-64-char-random-hex-string',
  'replace-with-a-strong-admin-password',
  'change-me',
  'secret',
];

function resolveJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret || WEAK_JWT_SECRETS.includes(secret.toLowerCase())) {
    if (IS_PRODUCTION) {
      throw new Error(
        '[CONFIG] JWT_SECRET must be set to a strong random value in production. ' +
        'Generate one with: node -e "console.log(require(\'crypto\').randomBytes(48).toString(\'hex\'))"'
      );
    }
    return 'dev-only-secret-do-not-use-in-production';
  }
  return secret;
}

function resolveCorsOrigins() {
  const raw = process.env.CORS_ORIGIN || '';
  const origins = raw
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

  if (IS_PRODUCTION && origins.length === 0) {
    throw new Error(
      '[CONFIG] CORS_ORIGIN must be set to a comma-separated list of allowed origins in production'
    );
  }

  return origins;
}

module.exports = {
  NODE_ENV,
  IS_PRODUCTION,
  PORT: parseInt(process.env.PORT || '5000', 10),
  JWT_SECRET: resolveJwtSecret(),
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '12h',
  CORS_ORIGINS: resolveCorsOrigins(),
  DATABASE_URL: process.env.DATABASE_URL || '',
  USE_POSTGRES: Boolean(process.env.DATABASE_URL),
  SMTP_HOST: process.env.SMTP_HOST || 'smtp.gmail.com',
  SMTP_PORT: parseInt(process.env.SMTP_PORT || '587', 10),
  SMTP_USER: process.env.SMTP_USER,
  SMTP_PASS: process.env.SMTP_PASS,
  NOTIFY_EMAIL: process.env.NOTIFY_EMAIL || process.env.SMTP_USER,
  ADMIN_EMAIL: process.env.ADMIN_EMAIL || 'admin@rexagency.com',
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
};
