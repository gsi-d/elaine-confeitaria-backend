const { usuarioRepository } = require('../repositories/usuarioRepository');

async function requireAdmin(request, response, next) {
  try {
    if (!request.user?.id) {
      return response.status(401).json({ message: 'Token não informado' });
    }

    const usuario = await usuarioRepository.findById(Number(request.user.id));

    if (!usuario?.isAdmin) {
      return response.status(403).json({ message: 'Acesso restrito a administradores' });
    }

    return next();
  } catch (error) {
    return next(error);
  }
}

module.exports = requireAdmin;
