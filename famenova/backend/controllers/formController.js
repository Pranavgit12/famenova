const { VALID_NICHES, NICHE_LABELS } = require('../models/Lead');
const { sendLeadNotification } = require('../services/emailService');
const { appendLead, getLeadCount } = require('../services/excelService');
const { formatDate } = require('../utils/helpers');

function validateFormBody(body) {
  const errors = {};
  const { fullName, phone, location, businessName, niche } = body;

  if (!fullName || !String(fullName).trim()) {
    errors.fullName = 'Full name is required';
  }
  if (!phone || !/^[\d\s\-+()]{7,}$/.test(String(phone).trim())) {
    errors.phone = 'Valid phone number is required';
  }
  if (!location || !String(location).trim()) {
    errors.location = 'Location is required';
  }
  if (!businessName || !String(businessName).trim()) {
    errors.businessName = 'Business name is required';
  }
  if (!niche || !VALID_NICHES.includes(niche)) {
    errors.niche = 'Please select a valid industry';
  }

  return { valid: Object.keys(errors).length === 0, errors };
}

async function submitForm(req, res, next) {
  try {
    const { valid, errors } = validateFormBody(req.body);
    if (!valid) {
      return res.status(400).json({ success: false, errors });
    }

    const nicheLabel = NICHE_LABELS[req.body.niche] || req.body.niche;

    const leadData = {
      fullName: String(req.body.fullName).trim(),
      phone: String(req.body.phone).trim(),
      location: String(req.body.location).trim(),
      businessName: String(req.body.businessName).trim(),
      niche: nicheLabel,
      nicheKey: req.body.niche,
    };

    let saved = false;

    if (!saved) {
      appendLead({
        ...leadData,
        submittedAt: formatDate(new Date()),
      });
    }

    sendLeadNotification({
      ...leadData,
      submittedAt: new Date(),
    }).catch(() => {});

    res.json({
      success: true,
      message: 'Your application has been received!',
    });
  } catch (err) {
    next(err);
  }
}

function getLeadCountEndpoint(_req, res) {
  try {
    const count = getLeadCount();
    res.json({ success: true, data: { count } });
  } catch (err) {
    res.status(500).json({ success: true, data: { count: 0 } });
  }
}

module.exports = { submitForm, getLeadCountEndpoint, validateFormBody };
