const { ensureSchema, query } = require('./pg');

const LEAD_COLUMNS = {
  fullName: 'full_name',
  phone: 'phone',
  location: 'location',
  businessName: 'business_name',
  niche: 'niche',
  status: 'status',
  notes: 'notes',
};

function rowToLead(row) {
  return {
    id: row.id,
    fullName: row.full_name || '',
    phone: row.phone || '',
    location: row.location || '',
    businessName: row.business_name || '',
    niche: row.niche || '',
    status: row.status || 'new',
    notes: row.notes || '',
    submittedAt: row.submitted_at || '',
  };
}

async function appendLead(lead) {
  await ensureSchema();
  const { rows } = await query(
    `INSERT INTO leads (full_name, phone, location, business_name, niche, status, notes, submitted_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     RETURNING id`,
    [
      lead.fullName,
      lead.phone,
      lead.location,
      lead.businessName,
      lead.niche || null,
      lead.status || 'new',
      lead.notes || '',
      lead.submittedAt || null,
    ]
  );
  return { id: rows[0].id };
}

async function getAllLeads() {
  await ensureSchema();
  const { rows } = await query(
    'SELECT * FROM leads ORDER BY id ASC'
  );
  return rows.map(rowToLead);
}

async function getLeadCount() {
  await ensureSchema();
  const { rows } = await query('SELECT COUNT(*)::int AS count FROM leads');
  return rows[0].count;
}

async function updateLeadById(id, updates) {
  await ensureSchema();
  const sets = [];
  const params = [];
  let i = 1;

  Object.keys(updates).forEach((key) => {
    const column = LEAD_COLUMNS[key];
    if (column && updates[key] !== undefined) {
      sets.push(`${column} = $${i}`);
      params.push(updates[key]);
      i += 1;
    }
  });

  if (sets.length === 0) return true;

  params.push(id);
  const { rowCount } = await query(
    `UPDATE leads SET ${sets.join(', ')} WHERE id = $${i}`,
    params
  );
  return rowCount > 0;
}

async function deleteLeadById(id) {
  await ensureSchema();
  const { rowCount } = await query('DELETE FROM leads WHERE id = $1', [id]);
  return rowCount > 0;
}

module.exports = {
  appendLead,
  getAllLeads,
  getLeadCount,
  updateLeadById,
  deleteLeadById,
};
