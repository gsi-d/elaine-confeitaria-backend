const {
  createInMemoryPrecoRepository,
  inMemoryPrecoRepository,
} = require('./inMemoryPrecoRepository');

module.exports = {
  createPrecoRepository: createInMemoryPrecoRepository,
  precoRepository: inMemoryPrecoRepository,
};
