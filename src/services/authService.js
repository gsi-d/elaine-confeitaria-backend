const prisma = require('../config/prisma');
const jwt = require('jsonwebtoken');
const { comparePassword } = require('../utils/password');
const { jwtSecret, jwtExpiresIn } = require('../config/env');
const { sanitizeUsuario } = require('./usuarioService');

async function login(email, senha) {
  const usuario = await prisma.usuario.findUnique({ where: { email } });

  if (!usuario) {
    const error = new Error('Usuário ou senha inválidos');
    error.statusCode = 401;
    throw error;
  }

  const isPasswordValid = await comparePassword(senha, usuario.senha);

  if (!isPasswordValid) {
    const error = new Error('Usuário ou senha inválidos');
    error.statusCode = 401;
    throw error;
  }

  const payload = {
    id: usuario.id,
    email: usuario.email,
  };

  const token = jwt.sign(payload, jwtSecret, {
    expiresIn: jwtExpiresIn,
  });

  const safeUsuario = sanitizeUsuario(usuario);

  return {
    token,
    usuario: safeUsuario,
  };
}

module.exports = {
  login,
};

