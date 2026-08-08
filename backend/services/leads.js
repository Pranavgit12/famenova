const { USE_POSTGRES } = require('../config/env');

module.exports = USE_POSTGRES
  ? require('./pgLeadsService')
  : require('./excelService');
