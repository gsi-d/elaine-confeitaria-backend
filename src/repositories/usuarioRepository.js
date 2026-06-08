const {
  createInMemoryUsuarioRepository,
  inMemoryUsuarioRepository,
} = require('./inMemoryUsuarioRepository');
const {
  createPrismaUsuarioRepository,
  prismaUsuarioRepository,
} = require('./prismaUsuarioRepository');
const { isPrismaPersistenceEnabled } = require('../config/persistence');

module.exports = {
  createUsuarioRepository: isPrismaPersistenceEnabled()
    ? createPrismaUsuarioRepository
    : createInMemoryUsuarioRepository,
  usuarioRepository: isPrismaPersistenceEnabled()
    ? prismaUsuarioRepository
    : inMemoryUsuarioRepository,
};
