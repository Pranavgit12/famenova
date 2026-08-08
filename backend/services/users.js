const { USE_POSTGRES } = require('../config/env');

module.exports = USE_POSTGRES
  ? require('./usersPg')
  : require('./usersFile');
