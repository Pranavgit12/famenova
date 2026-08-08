const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const rateLimit = require('express-rate-limit');
const validate = require('../middleware/validate');
const { submitForm, getLeadCountEndpoint } = require('../controllers/formController');
const { VALID_NICHES } = require('../config/constants');

const submitLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 5,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { success: false, message: 'Too many submissions. Please try again later.' },
});

const countLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 60,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
});

const formValidation = [
  body('fullName')
    .trim()
    .notEmpty().withMessage('Full name is required')
    .isLength({ max: 200 }).withMessage('Full name is too long'),
  body('phone')
    .trim()
    .notEmpty().withMessage('Phone number is required')
    .matches(/^[\d\s\-+()]{7,}$/).withMessage('Valid phone number is required'),
  body('location')
    .trim()
    .notEmpty().withMessage('Location is required')
    .isLength({ max: 200 }).withMessage('Location is too long'),
  body('businessName')
    .trim()
    .notEmpty().withMessage('Business name is required')
    .isLength({ max: 200 }).withMessage('Business name is too long'),
  body('niche')
    .notEmpty().withMessage('Industry is required')
    .isIn(VALID_NICHES).withMessage('Please select a valid industry'),
];

router.post('/submit', submitLimiter, formValidation, validate, submitForm);

router.get('/leads/count', countLimiter, getLeadCountEndpoint);

module.exports = router;
