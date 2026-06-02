const jwt = require('jsonwebtoken');
const { comparePassword } = require('../utils/password');
const { jwtSecret, jwtExpiresIn } = require('../config/env');
const { sanitizeUsuario } = require('./usuarioService');
const { createHttpError } = require('../errors/httpError');
const { usuarioRepository } = require('../repositories/usuarioRepository');

function createAuthService(dependencies = {}) {
  const {
    repository = usuarioRepository,
    passwordComparer = comparePassword,
    tokenSigner = jwt.sign,
    secret = jwtSecret,
    expiresIn = jwtExpiresIn,
  } = dependencies;

  return {
    async login(email, senha) {
      const usuario = await repository.findByEmail(email);

      if (!usuario) {
        throw createHttpError(401, 'Usuário ou senha inválidos');
      }

      const isPasswordValid = await passwordComparer(senha, usuario.senha);

      if (!isPasswordValid) {
        throw createHttpError(401, 'Usuário ou senha inválidos');
      }

      const payload = {
        id: usuario.id,
        email: usuario.email,
      };

      const token = tokenSigner(payload, secret, {
        expiresIn,
      });

      const safeUsuario = sanitizeUsuario(usuario);

      return {
        token,
        usuario: safeUsuario,
      };
    },
  };
}

module.exports = {
  createAuthService,
  ...createAuthService(),
};
