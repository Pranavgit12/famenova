const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const { authenticate, authorize } = require('../middleware/auth');
const { NICHE_LABELS } = require('../config/constants');
const {
  createLead,
  getAll,
  getById,
  update,
  remove,
  getStats,
} = require('../controllers/leadController');

const nicheValues = Object.keys(NICHE_LABELS);

const createLeadValidation = [
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
    .isIn(nicheValues).withMessage('Please select a valid industry'),
  body('notes')
    .optional()
    .isLength({ max: 2000 }).withMessage('Notes too long'),
];

const updateLeadValidation = [
  body('status')
    .optional()
    .isIn(['new', 'contacted', 'qualified', 'closed', 'lost']).withMessage('Invalid status'),
  body('notes')
    .optional()
    .isLength({ max: 2000 }).withMessage('Notes too long'),
  body('fullName').not().exists().withMessage('Field is read-only'),
  body('phone').not().exists().withMessage('Field is read-only'),
  body('location').not().exists().withMessage('Field is read-only'),
  body('businessName').not().exists().withMessage('Field is read-only'),
  body('niche').not().exists().withMessage('Field is read-only'),
];

router.use(authenticate);
router.use(authorize('admin', 'editor'));

router.get('/stats', getStats);
router.get('/', getAll);
router.get('/:id', getById);
router.post('/', createLeadValidation, validate, createLead);
router.put('/:id', updateLeadValidation, validate, update);
router.delete('/:id', authorize('admin'), remove);

module.exports = router;
