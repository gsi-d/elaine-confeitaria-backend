const crypto = require('crypto');
const { encryptionSecret } = require('../config/env');

const key = crypto.createHash('sha256').update(String(encryptionSecret)).digest();
const IV_LENGTH = 16;

function encrypt(value) {
  if (value === null || value === undefined) {
    return value;
  }

  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv('aes-256-ctr', key, iv);
  const encrypted = Buffer.concat([cipher.update(String(value), 'utf8'), cipher.final()]);

  return `${iv.toString('hex')}:${encrypted.toString('hex')}`;
}

function decrypt(payload) {
  if (payload === null || payload === undefined) {
    return payload;
  }

  const parts = String(payload).split(':');
  if (parts.length !== 2) {
    return payload;
  }

  const iv = Buffer.from(parts[0], 'hex');
  const encryptedText = Buffer.from(parts[1], 'hex');

  const decipher = crypto.createDecipheriv('aes-256-ctr', key, iv);
  const decrypted = Buffer.concat([decipher.update(encryptedText), decipher.final()]);

  return decrypted.toString('utf8');
}

module.exports = {
  encrypt,
  decrypt,
};

