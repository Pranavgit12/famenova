const { transporter } = require('../config/mailer');

async function sendLeadNotification(lead) {
  const to = process.env.NOTIFY_EMAIL || process.env.SMTP_USER;
  if (!to) {
    console.warn('[EMAIL] No recipient configured — skipping notification');
    return;
  }

  const submittedDate = lead.submittedAt
    ? new Date(lead.submittedAt).toLocaleString('en-US', { timeZone: 'America/New_York' })
    : new Date().toLocaleString('en-US', { timeZone: 'America/New_York' });

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #6366f1;">New Lead from REX Agency Website</h2>
      <table style="width: 100%; border-collapse: collapse;">
        <tr><td style="padding: 8px; font-weight: bold;">Full Name:</td><td style="padding: 8px;">${lead.fullName}</td></tr>
        <tr><td style="padding: 8px; font-weight: bold;">Phone:</td><td style="padding: 8px;">${lead.phone}</td></tr>
        <tr><td style="padding: 8px; font-weight: bold;">Location:</td><td style="padding: 8px;">${lead.location}</td></tr>
        <tr><td style="padding: 8px; font-weight: bold;">Business:</td><td style="padding: 8px;">${lead.businessName}</td></tr>
        <tr><td style="padding: 8px; font-weight: bold;">Industry:</td><td style="padding: 8px;">${lead.niche}</td></tr>
        <tr><td style="padding: 8px; font-weight: bold;">Submitted:</td><td style="padding: 8px;">${submittedDate}</td></tr>
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
    console.log(`[EMAIL] Notification sent for lead: ${lead.fullName}`);
  } catch (err) {
    console.error('[EMAIL] Notification failed:', err.message);
  }
}

async function sendPasswordResetEmail(user, resetToken) {
  const to = user.email;
  const resetUrl = `${process.env.CLIENT_URL || 'http://localhost:5000'}/reset-password?token=${resetToken}`;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #6366f1;">Password Reset — REX Agency</h2>
      <p>Hello ${user.name},</p>
      <p>You requested a password reset. Click the link below to set a new password:</p>
      <a href="${resetUrl}" style="display:inline-block;padding:12px 24px;background:#6366f1;color:#fff;text-decoration:none;border-radius:6px;">Reset Password</a>
      <p style="margin-top:24px;color:#888;">This link expires in 1 hour. If you did not request this, ignore this email.</p>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: `"REX Agency" <${process.env.SMTP_USER}>`,
      to,
      subject: 'Password Reset Request',
      html,
    });
  } catch (err) {
    console.error('[EMAIL] Password reset email failed:', err.message);
  }
}

module.exports = { sendLeadNotification, sendPasswordResetEmail };
