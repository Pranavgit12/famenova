const express = require('express');
const router = express.Router();

const formRoutes = require('./form');
const authRoutes = require('./auth');
const leadsRoutes = require('./leads');

router.use('/form', formRoutes);
router.use('/auth', authRoutes);
router.use('/leads', leadsRoutes);

module.exports = router;
