const { createHttpError } = require('../errors/httpError');

function validateLoginPayload(payload) {
  if (!payload || typeof payload !== 'object') {
    throw createHttpError(400, 'Payload de login inválido');
  }

  const { email, senha } = payload;

  if (!email || !senha) {
    throw createHttpError(400, 'Email e senha são obrigatórios');
  }

  return {
    email: String(email).trim().toLowerCase(),
    senha: String(senha),
  };
}

module.exports = {
  validateLoginPayload,
};
