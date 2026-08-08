const { appendLead, getAllLeads, updateLeadById, deleteLeadById } = require('../services/leads');
const { formatDate, paginate, paginatedResponse } = require('../utils/helpers');

async function createLead(req, res, next) {
  try {
    const { fullName, phone, location, businessName, niche, notes } = req.body;
    const { NICHE_LABELS } = require('../config/constants');

    const leadData = {
      fullName: String(fullName).trim(),
      phone: String(phone).trim(),
      location: String(location).trim(),
      businessName: String(businessName).trim(),
      niche: NICHE_LABELS[niche] || niche,
      nicheKey: niche,
      notes: notes ? String(notes).trim() : '',
    };

    await appendLead({ ...leadData, submittedAt: formatDate(new Date()) });

    res.status(201).json({
      success: true,
      message: 'Lead created successfully',
    });
  } catch (err) {
    next(err);
  }
}

async function getAll(req, res, next) {
  try {
    const { page, limit, search, status } = req.query;
    const { page: p, limit: l, skip } = paginate(page, limit);

    let leads = await getAllLeads();

    if (search) {
      const q = String(search).toLowerCase();
      leads = leads.filter(
        (lead) =>
          lead.fullName.toLowerCase().includes(q) ||
          lead.businessName.toLowerCase().includes(q) ||
          lead.phone.includes(q)
      );
    }
    if (status) {
      leads = leads.filter((lead) => lead.status === status);
    }

    const total = leads.length;
    const paginatedLeads = leads.slice(skip, skip + l);

    res.json(paginatedResponse(paginatedLeads, total, p, l));
  } catch (err) {
    next(err);
  }
}

async function getById(req, res, next) {
  try {
    const { id } = req.params;
    const leads = await getAllLeads();
    const lead = leads.find((l) => String(l.id) === String(id));

    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }

    res.json({ success: true, data: { lead } });
  } catch (err) {
    next(err);
  }
}

async function update(req, res, next) {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (!Number.isInteger(Number(id)) || Number(id) < 1) {
      return res.status(400).json({ success: false, message: 'Invalid lead id' });
    }

    const updated = await updateLeadById(parseInt(id, 10), updates);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }

    res.json({ success: true, message: 'Lead updated successfully' });
  } catch (err) {
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    const { id } = req.params;

    if (!Number.isInteger(Number(id)) || Number(id) < 1) {
      return res.status(400).json({ success: false, message: 'Invalid lead id' });
    }

    const deleted = await deleteLeadById(parseInt(id, 10));
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }

    res.json({ success: true, message: 'Lead deleted successfully' });
  } catch (err) {
    next(err);
  }
}

async function getStats(_req, res, next) {
  try {
    const leads = await getAllLeads();
    const total = leads.length;
    const byStatus = {};
    const nicheCounts = {};

    leads.forEach((lead) => {
      byStatus[lead.status] = (byStatus[lead.status] || 0) + 1;
      nicheCounts[lead.niche] = (nicheCounts[lead.niche] || 0) + 1;
    });

    const byNiche = Object.entries(nicheCounts)
      .map(([niche, count]) => ({ niche, count }))
      .sort((a, b) => b.count - a.count);

    res.json({
      success: true,
      data: {
        total,
        byStatus,
        byNiche,
        recent: leads.slice(0, 5),
      },
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createLead,
  getAll,
  getById,
  update,
  remove,
  getStats,
};
