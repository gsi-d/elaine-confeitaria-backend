const { createHttpError } = require('../errors/httpError');
const {
  inMemoryTabelaPrecoRepository,
} = require('../repositories/inMemoryTabelaPrecoRepository');

async function getAllTabelasPreco() {
  return inMemoryTabelaPrecoRepository.findMany();
}

async function getTabelaPrecoById(id) {
  const tabela = await inMemoryTabelaPrecoRepository.findById(id);

  if (!tabela) {
    throw createHttpError(404, 'Tabela de preço não encontrada');
  }

  return tabela;
}

module.exports = {
  getAllTabelasPreco,
  getTabelaPrecoById,
};
