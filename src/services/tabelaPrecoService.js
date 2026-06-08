const { createHttpError } = require('../errors/httpError');
const {
  inMemoryTabelaPrecoRepository,
} = require('../repositories/inMemoryTabelaPrecoRepository');
const {
  prismaTabelaPrecoRepository,
} = require('../repositories/prismaTabelaPrecoRepository');
const { isPrismaPersistenceEnabled } = require('../config/persistence');

const repository = isPrismaPersistenceEnabled()
  ? prismaTabelaPrecoRepository
  : inMemoryTabelaPrecoRepository;

async function getAllTabelasPreco() {
  return repository.findMany();
}

async function getTabelaPrecoById(id) {
  const tabela = await repository.findById(id);

  if (!tabela) {
    throw createHttpError(404, 'Tabela de preço não encontrada');
  }

  return tabela;
}

module.exports = {
  getAllTabelasPreco,
  getTabelaPrecoById,
};
