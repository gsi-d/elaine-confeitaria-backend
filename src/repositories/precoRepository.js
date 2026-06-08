const {
  createInMemoryPrecoRepository,
  inMemoryPrecoRepository,
} = require('./inMemoryPrecoRepository');
const {
  createPrismaPrecoRepository,
  prismaPrecoRepository,
} = require('./prismaPrecoRepository');
const { isPrismaPersistenceEnabled } = require('../config/persistence');

module.exports = {
  createPrecoRepository: isPrismaPersistenceEnabled()
    ? createPrismaPrecoRepository
    : createInMemoryPrecoRepository,
  precoRepository: isPrismaPersistenceEnabled()
    ? prismaPrecoRepository
    : inMemoryPrecoRepository,
};
