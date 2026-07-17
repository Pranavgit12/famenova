const express = require('express');
const router = express.Router();
const { appendLead, getLeadCount } = require('../utils/excel');
const { sendNotification } = require('../config/mailer');

const VALID_NICHES = [
  'ecommerce', 'saas', 'health', 'fitness', 'realestate',
  'finance', 'education', 'food', 'beauty', 'local', 'agency', 'other',
];

const NICHE_LABELS = {
  ecommerce: 'E-Commerce',
  saas: 'SaaS / Tech',
  health: 'Health & Wellness',
  fitness: 'Fitness / Coaching',
  realestate: 'Real Estate',
  finance: 'Finance / Insurance',
  education: 'Education / Courses',
  food: 'Food & Beverage',
  beauty: 'Beauty / Skincare',
  local: 'Local Service Business',
  agency: 'Agency / B2B',
  other: 'Other',
};

function validate(body) {
  const errors = {};
  const { fullName, phone, location, businessName, niche } = body;

  if (!fullName || !fullName.trim()) errors.fullName = 'Full name is required';
  if (!phone || !/^[\d\s\-+()]{7,}$/.test(phone.trim())) errors.phone = 'Valid phone number is required';
  if (!location || !location.trim()) errors.location = 'Location is required';
  if (!businessName || !businessName.trim()) errors.businessName = 'Business name is required';
  if (!niche || !VALID_NICHES.includes(niche)) errors.niche = 'Please select a valid industry';

  return { valid: Object.keys(errors).length === 0, errors };
}

router.post('/submit', async (req, res) => {
  try {
    const { valid, errors } = validate(req.body);
    if (!valid) {
      return res.status(400).json({ success: false, errors });
    }

    const lead = {
      fullName: req.body.fullName.trim(),
      phone: req.body.phone.trim(),
      location: req.body.location.trim(),
      businessName: req.body.businessName.trim(),
      niche: NICHE_LABELS[req.body.niche] || req.body.niche,
      submittedAt: new Date().toLocaleString('en-US', { timeZone: 'America/New_York' }),
    };

    appendLead(lead);

    sendNotification(lead).catch(() => {});

    res.json({ success: true, message: 'Your application has been received!' });
  } catch (err) {
    console.error('Form submission error:', err);
    res.status(500).json({ success: false, message: 'Something went wrong. Please try again.' });
  }
});

router.get('/leads/count', (_req, res) => {
  try {
    const count = getLeadCount();
    res.json({ count });
  } catch (err) {
    res.status(500).json({ count: 0 });
  }
});

module.exports = router;
