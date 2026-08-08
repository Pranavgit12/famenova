const nodemailer = require('nodemailer');

const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = require('./env');

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: SMTP_PORT === 465,
  auth: SMTP_USER && SMTP_PASS ? { user: SMTP_USER, pass: SMTP_PASS } : undefined,
  tls: {
    rejectUnauthorized: true,
  },
});

async function verifyConnection() {
  try {
    await transporter.verify();
    console.log('[MAIL] SMTP connection verified');
    return true;
  } catch (err) {
    console.warn('[MAIL] SMTP verification failed:', err.message);
    return false;
  }
}

module.exports = { transporter, verifyConnection };
