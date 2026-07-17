const XLSX = require('xlsx');
const path = require('path');
const fs = require('fs');

const EXCEL_PATH = path.resolve(process.env.EXCEL_PATH || './dataset/leads.xlsx');

const HEADERS = [
  'Full Name',
  'Phone Number',
  'Location / City',
  'Business Name',
  'Business Niche',
  'Status',
  'Notes',
  'Submitted At',
];

function ensureExcel() {
  const dir = path.dirname(EXCEL_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  if (!fs.existsSync(EXCEL_PATH)) {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet([HEADERS]);
    XLSX.utils.book_append_sheet(wb, ws, 'Leads');
    XLSX.writeFile(wb, EXCEL_PATH);
  }
}

function appendLead(lead) {
  ensureExcel();

  const wb = XLSX.readFile(EXCEL_PATH);
  const ws = wb.Sheets[wb.SheetNames[0]];

  const submittedDate = lead.submittedAt
    ? new Date(lead.submittedAt).toLocaleString('en-US', { timeZone: 'America/New_York' })
    : new Date().toLocaleString('en-US', { timeZone: 'America/New_York' });

  const rowData = [
    lead.fullName,
    lead.phone,
    lead.location,
    lead.businessName,
    lead.niche,
    lead.status || 'new',
    lead.notes || '',
    submittedDate,
  ];

  const range = XLSX.utils.decode_range(ws['!ref']);
  const nextRow = range.e.r + 1;

  for (let col = 0; col < rowData.length; col++) {
    const cellRef = XLSX.utils.encode_cell({ r: nextRow, c: col });
    ws[cellRef] = { t: 's', v: rowData[col] };
  }

  ws['!ref'] = XLSX.utils.encode_range({
    s: { r: 0, c: 0 },
    e: { r: nextRow, c: rowData.length - 1 },
  });

  XLSX.writeFile(wb, EXCEL_PATH);
}

function getAllLeads() {
  ensureExcel();

  const wb = XLSX.readFile(EXCEL_PATH);
  const ws = wb.Sheets[wb.SheetNames[0]];
  const data = XLSX.utils.sheet_to_json(ws);

  return data.map((row, index) => ({
    id: index + 1,
    fullName: row['Full Name'] || '',
    phone: row['Phone Number'] || '',
    location: row['Location / City'] || '',
    businessName: row['Business Name'] || '',
    niche: row['Business Niche'] || '',
    status: row['Status'] || 'new',
    notes: row['Notes'] || '',
    submittedAt: row['Submitted At'] || '',
  }));
}

function getLeadCount() {
  if (!fs.existsSync(EXCEL_PATH)) return 0;

  const wb = XLSX.readFile(EXCEL_PATH);
  const ws = wb.Sheets[wb.SheetNames[0]];
  const range = XLSX.utils.decode_range(ws['!ref']);
  return range.e.r;
}

function updateLeadById(id, updates) {
  ensureExcel();

  const wb = XLSX.readFile(EXCEL_PATH);
  const ws = wb.Sheets[wb.SheetNames[0]];
  const range = XLSX.utils.decode_range(ws['!ref']);

  const rowIndex = id;
  if (rowIndex < 1 || rowIndex > range.e.r) {
    return false;
  }

  const fieldMap = {
    fullName: 0,
    phone: 1,
    location: 2,
    businessName: 3,
    niche: 4,
    status: 5,
    notes: 6,
  };

  Object.keys(updates).forEach((key) => {
    if (fieldMap[key] !== undefined && updates[key] !== undefined) {
      const cellRef = XLSX.utils.encode_cell({ r: rowIndex, c: fieldMap[key] });
      ws[cellRef] = { t: 's', v: updates[key] };
    }
  });

  XLSX.writeFile(wb, EXCEL_PATH);
  return true;
}

function deleteLeadById(id) {
  ensureExcel();

  const wb = XLSX.readFile(EXCEL_PATH);
  const ws = wb.Sheets[wb.SheetNames[0]];
  const range = XLSX.utils.decode_range(ws['!ref']);

  const rowIndex = id;
  if (rowIndex < 1 || rowIndex > range.e.r) {
    return false;
  }

  for (let col = range.s.c; col <= range.e.c; col++) {
    const cellRef = XLSX.utils.encode_cell({ r: rowIndex, c: col });
    delete ws[cellRef];
  }

  ws['!ref'] = XLSX.utils.encode_range({
    s: { r: 0, c: 0 },
    e: { r: range.e.r - 1, c: range.e.c },
  });

  XLSX.writeFile(wb, EXCEL_PATH);
  return true;
}

module.exports = {
  appendLead,
  getAllLeads,
  getLeadCount,
  updateLeadById,
  deleteLeadById,
};
