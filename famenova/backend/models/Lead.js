const mongoose = require('mongoose');

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

const leadSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
      maxlength: 200,
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
      match: [/^[\d\s\-+()]{7,}$/, 'Valid phone number is required'],
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
      maxlength: 200,
    },
    businessName: {
      type: String,
      required: [true, 'Business name is required'],
      trim: true,
      maxlength: 200,
    },
    niche: {
      type: String,
      required: [true, 'Industry is required'],
      enum: {
        values: Object.values(NICHE_LABELS),
        message: 'Please select a valid industry',
      },
    },
    nicheKey: {
      type: String,
      enum: VALID_NICHES,
    },
    status: {
      type: String,
      enum: ['new', 'contacted', 'closed'],
      default: 'new',
    },
    notes: {
      type: String,
      trim: true,
      maxlength: 2000,
      default: '',
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

leadSchema.index({ status: 1 });
leadSchema.index({ nicheKey: 1 });
leadSchema.index({ submittedAt: -1 });
leadSchema.index({ businessName: 'text', fullName: 'text' });

leadSchema.virtual('submittedAtFormatted').get(function () {
  return this.submittedAt.toLocaleString('en-US', { timeZone: 'America/New_York' });
});

leadSchema.set('toJSON', { virtuals: true });

const Lead = mongoose.model('Lead', leadSchema);

module.exports = { Lead, VALID_NICHES, NICHE_LABELS };
