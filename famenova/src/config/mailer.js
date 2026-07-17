const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

async function sendNotification(lead) {
  const to = process.env.NOTIFY_EMAIL || process.env.SMTP_USER;
  if (!to) return;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #6366f1;">New Lead from REX Agency Website</h2>
      <table style="width: 100%; border-collapse: collapse;">
        <tr><td style="padding: 8px; font-weight: bold;">Full Name:</td><td style="padding: 8px;">${lead.fullName}</td></tr>
        <tr><td style="padding: 8px; font-weight: bold;">Phone:</td><td style="padding: 8px;">${lead.phone}</td></tr>
        <tr><td style="padding: 8px; font-weight: bold;">Location:</td><td style="padding: 8px;">${lead.location}</td></tr>
        <tr><td style="padding: 8px; font-weight: bold;">Business:</td><td style="padding: 8px;">${lead.businessName}</td></tr>
        <tr><td style="padding: 8px; font-weight: bold;">Industry:</td><td style="padding: 8px;">${lead.niche}</td></tr>
        <tr><td style="padding: 8px; font-weight: bold;">Submitted:</td><td style="padding: 8px;">${lead.submittedAt}</td></tr>
      </table>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: `"REX Agency Website" <${process.env.SMTP_USER}>`,
      to,
      subject: `New Lead: ${lead.fullName} — ${lead.businessName}`,
      html,
    });
  } catch (err) {
    console.error('Email notification failed:', err.message);
  }
}

module.exports = { sendNotification };
