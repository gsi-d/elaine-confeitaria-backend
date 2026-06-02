const dotenv = require('dotenv');

dotenv.config();

const nodeEnv = process.env.NODE_ENV || 'development';
const isProduction = nodeEnv === 'production';

function resolveSecret(envValue, fallbackValue, envVarName) {
  if (envValue) {
    return envValue;
  }

  if (isProduction) {
    throw new Error(`${envVarName} é obrigatório em produção`);
  }

  return fallbackValue;
}

const config = {
  nodeEnv,
  port: process.env.PORT || 3000,
  jwtSecret: resolveSecret(
    process.env.JWT_SECRET,
    'dev-jwt-secret-elaine',
    'JWT_SECRET',
  ),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1h',
  encryptionSecret: resolveSecret(
    process.env.ENCRYPTION_SECRET,
    'dev-encryption-secret-elaine',
    'ENCRYPTION_SECRET',
  ),
  bcryptSaltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS || '10', 10),
  databaseUrl: process.env.DATABASE_URL,
};

module.exports = config;
