const bcrypt = require('bcryptjs');
const { bcryptSaltRounds } = require('../config/env');

async function hashPassword(plainPassword) {
  return bcrypt.hash(plainPassword, bcryptSaltRounds);
}

async function comparePassword(plainPassword, hashedPassword) {
  return bcrypt.compare(plainPassword, hashedPassword);
}

module.exports = {
  hashPassword,
  comparePassword,
};

