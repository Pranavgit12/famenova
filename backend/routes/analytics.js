const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');
const { getAllLeads } = require('../services/excelService');
const { IS_PRODUCTION } = require('../config/env');

router.use(authenticate);
router.use(authorize('admin', 'editor'));

function fail(res, err) {
  const message = IS_PRODUCTION ? 'Internal server error' : err.message;
  res.status(500).json({ success: false, message });
}

router.get('/overview', async (_req, res) => {
  try {
    const leads = await getAllLeads();
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
    fail(res, err);
  }
});

router.get('/trends', async (_req, res) => {
  try {
    const leads = await getAllLeads();
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
    fail(res, err);
  }
});

router.get('/by-niche', async (_req, res) => {
  try {
    const leads = await getAllLeads();
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
    fail(res, err);
  }
});

router.get('/by-location', async (_req, res) => {
  try {
    const leads = await getAllLeads();
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
    fail(res, err);
  }
});

router.get('/funnel', async (_req, res) => {
  try {
    const leads = await getAllLeads();
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
    fail(res, err);
  }
});

module.exports = router;
