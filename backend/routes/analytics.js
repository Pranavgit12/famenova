const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');
const { getAllLeads } = require('../services/excelService');

router.use(authenticate);
router.use(authorize('admin', 'editor'));

router.get('/overview', (_req, res) => {
  try {
    const leads = getAllLeads();
    const total = leads.length;
    const byStatus = {};
    leads.forEach((l) => {
      byStatus[l.status] = (byStatus[l.status] || 0) + 1;
    });

    const closed = byStatus.closed || 0;
    const conversionRate = total > 0 ? ((closed / total) * 100).toFixed(1) : 0;

    res.json({
      success: true,
      data: {
        totalLeads: total,
        conversionRate,
        avgResponseTime: '2h',
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/trends', (_req, res) => {
  try {
    const leads = getAllLeads();
    const byDate = {};

    leads.forEach((l) => {
      const date = l.submittedAt
        ? l.submittedAt.split(',')[0].trim()
        : 'Unknown';
      byDate[date] = (byDate[date] || 0) + 1;
    });

    const data = Object.entries(byDate)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(-30);

    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/by-niche', (_req, res) => {
  try {
    const leads = getAllLeads();
    const counts = {};

    leads.forEach((l) => {
      const niche = l.niche || 'Unknown';
      counts[niche] = (counts[niche] || 0) + 1;
    });

    const data = Object.entries(counts)
      .map(([niche, count]) => ({ niche, count }))
      .sort((a, b) => b.count - a.count);

    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/by-location', (_req, res) => {
  try {
    const leads = getAllLeads();
    const counts = {};

    leads.forEach((l) => {
      const location = l.location || 'Unknown';
      counts[location] = (counts[location] || 0) + 1;
    });

    const data = Object.entries(counts)
      .map(([location, count]) => ({ location, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/funnel', (_req, res) => {
  try {
    const leads = getAllLeads();
    const total = leads.length;
    const contacted = leads.filter((l) => l.status === 'contacted' || l.status === 'closed').length;
    const closed = leads.filter((l) => l.status === 'closed').length;

    const data = [
      { label: 'Total Leads', count: total },
      { label: 'Contacted', count: contacted },
      { label: 'Closed', count: closed },
    ];

    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
