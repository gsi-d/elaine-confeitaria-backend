const { createHttpError } = require('../errors/httpError');
const { inMemoryTpItemRepository } = require('../repositories/inMemoryTpItemRepository');
const { prismaTpItemRepository } = require('../repositories/prismaTpItemRepository');
const { isPrismaPersistenceEnabled } = require('../config/persistence');

const repository = isPrismaPersistenceEnabled() ? prismaTpItemRepository : inMemoryTpItemRepository;

async function getAllTpItems() {
  return repository.findMany();
}

async function getTpItemById(id) {
  const item = await repository.findById(id);

  if (!item) {
    throw createHttpError(404, 'Item de tabela de preço não encontrado');
  }

  return item;
}

module.exports = {
  getAllTpItems,
  getTpItemById,
};
