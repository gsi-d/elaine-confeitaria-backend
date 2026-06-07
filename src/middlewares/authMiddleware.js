const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config/env');

function authMiddleware(request, response, next) {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    return next();
  }

  const parts = authHeader.split(' ');

  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return response.status(401).json({ message: 'Formato de token inválido' });
  }

  const token = parts[1];

  try {
    const decoded = jwt.verify(token, jwtSecret);
    request.user = decoded;
    return next();
  } catch (error) {
    return response.status(401).json({ message: 'Token inválido ou expirado' });
  }
}

module.exports = authMiddleware;
