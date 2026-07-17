const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587', 10),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
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
