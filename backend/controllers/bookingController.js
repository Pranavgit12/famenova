async function getSlots(req, res) {
  res.json({ success: false, message: 'Booking is handled by Calendly. Visit https://calendly.com/famenovaa/30min' })
}

async function bookSlot(req, res) {
  res.json({ success: false, message: 'Booking is handled by Calendly. Visit https://calendly.com/famenovaa/30min' })
}

module.exports = { getSlots, bookSlot };
