const express = require('express');
const router = express.Router();
const { getSlots, bookSlot } = require('../controllers/bookingController');

router.get('/slots', getSlots);
router.post('/book', bookSlot);

module.exports = router;
