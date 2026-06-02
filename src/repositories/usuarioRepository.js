const {
  createInMemoryUsuarioRepository,
  inMemoryUsuarioRepository,
} = require('./inMemoryUsuarioRepository');

module.exports = {
  createUsuarioRepository: createInMemoryUsuarioRepository,
  usuarioRepository: inMemoryUsuarioRepository,
};
