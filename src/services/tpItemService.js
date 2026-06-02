const { createHttpError } = require('../errors/httpError');
const { inMemoryTpItemRepository } = require('../repositories/inMemoryTpItemRepository');

async function getAllTpItems() {
  return inMemoryTpItemRepository.findMany();
}

async function getTpItemById(id) {
  const item = await inMemoryTpItemRepository.findById(id);

  if (!item) {
    throw createHttpError(404, 'Item de tabela de preço não encontrado');
  }

  return item;
}

module.exports = {
  getAllTpItems,
  getTpItemById,
};
