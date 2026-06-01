const dotenv = require('dotenv');

dotenv.config();

const config = {
  port: process.env.PORT || 3000,
  jwtSecret: process.env.JWT_SECRET || 'change-me-jwt-secret',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1h',
  encryptionSecret: process.env.ENCRYPTION_SECRET || 'change-me-encryption-secret',
  bcryptSaltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS || '10', 10),
  databaseUrl: process.env.DATABASE_URL,
};

module.exports = config;
