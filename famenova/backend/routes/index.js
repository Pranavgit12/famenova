const express = require('express');
const router = express.Router();

const formRoutes = require('./form');
const authRoutes = require('./auth');
const leadsRoutes = require('./leads');
const analyticsRoutes = require('./analytics');

router.use('/form', formRoutes);
router.use('/auth', authRoutes);
router.use('/leads', leadsRoutes);
router.use('/analytics', analyticsRoutes);

module.exports = router;
