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

  const rowData = [
    lead.fullName,
    lead.phone,
    lead.location,
    lead.businessName,
    lead.niche,
    lead.submittedAt,
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

function getLeadCount() {
  if (!fs.existsSync(EXCEL_PATH)) return 0;

  const wb = XLSX.readFile(EXCEL_PATH);
  const ws = wb.Sheets[wb.SheetNames[0]];
  const range = XLSX.utils.decode_range(ws['!ref']);
  return range.e.r;
}

module.exports = { appendLead, getLeadCount };
