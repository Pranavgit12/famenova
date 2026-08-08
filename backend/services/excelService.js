const ExcelJS = require('exceljs');
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

const COLUMN_MAP = {
  fullName: 1,
  phone: 2,
  location: 3,
  businessName: 4,
  niche: 5,
  status: 6,
  notes: 7,
};

const FORMULA_START = /^[=@\t\r]/;
const FORMULA_LIKE = /^[+\-]\s*[A-Za-z(@=+\-]/;

function sanitizeCell(value) {
  const str = value == null ? '' : String(value);
  if (str.length > 0 && (FORMULA_START.test(str) || FORMULA_LIKE.test(str))) {
    return `'${str}`;
  }
  return str;
}

async function ensureExcel() {
  const dir = path.dirname(EXCEL_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  if (!fs.existsSync(EXCEL_PATH)) {
    const wb = new ExcelJS.Workbook();
    const ws = wb.addWorksheet('Leads');
    ws.addRow(HEADERS);
    await wb.xlsx.writeFile(EXCEL_PATH);
  }
}

async function appendLead(lead) {
  await ensureExcel();

  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile(EXCEL_PATH);
  const ws = wb.getWorksheet(1);

  const submittedDate = lead.submittedAt
    ? new Date(lead.submittedAt).toLocaleString('en-US', { timeZone: 'America/New_York' })
    : new Date().toLocaleString('en-US', { timeZone: 'America/New_York' });

  ws.addRow([
    sanitizeCell(lead.fullName),
    sanitizeCell(lead.phone),
    sanitizeCell(lead.location),
    sanitizeCell(lead.businessName),
    sanitizeCell(lead.niche),
    sanitizeCell(lead.status || 'new'),
    sanitizeCell(lead.notes || ''),
    submittedDate,
  ]);

  await wb.xlsx.writeFile(EXCEL_PATH);
}

async function getAllLeads() {
  await ensureExcel();

  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile(EXCEL_PATH);
  const ws = wb.getWorksheet(1);

  const rows = [];
  ws.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return;
    const get = (index) => {
      const cell = row.getCell(index).value;
      if (cell === null || cell === undefined) return '';
      if (typeof cell === 'object' && 'text' in cell && cell.richText) {
        return cell.richText.map((t) => t.text).join('');
      }
      return String(cell);
    };

    rows.push({
      id: rowNumber - 1,
      fullName: get(1),
      phone: get(2),
      location: get(3),
      businessName: get(4),
      niche: get(5),
      status: get(6),
      notes: get(7),
      submittedAt: get(8),
    });
  });

  return rows;
}

async function getLeadCount() {
  if (!fs.existsSync(EXCEL_PATH)) return 0;

  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile(EXCEL_PATH);
  const ws = wb.getWorksheet(1);

  return Math.max(0, ws.rowCount - 1);
}

async function updateLeadById(id, updates) {
  await ensureExcel();

  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile(EXCEL_PATH);
  const ws = wb.getWorksheet(1);

  const rowIndex = Number(id) + 1;
  if (rowIndex < 2 || rowIndex > ws.rowCount) {
    return false;
  }

  const row = ws.getRow(rowIndex);

  Object.keys(updates).forEach((key) => {
    if (COLUMN_MAP[key] !== undefined && updates[key] !== undefined) {
      row.getCell(COLUMN_MAP[key]).value = sanitizeCell(updates[key]);
    }
  });

  row.commit();
  await wb.xlsx.writeFile(EXCEL_PATH);
  return true;
}

async function deleteLeadById(id) {
  await ensureExcel();

  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile(EXCEL_PATH);
  const ws = wb.getWorksheet(1);

  const rowIndex = Number(id) + 1;
  if (rowIndex < 2 || rowIndex > ws.rowCount) {
    return false;
  }

  ws.spliceRows(rowIndex, 1);
  await wb.xlsx.writeFile(EXCEL_PATH);
  return true;
}

module.exports = {
  appendLead,
  getAllLeads,
  getLeadCount,
  updateLeadById,
  deleteLeadById,
};
