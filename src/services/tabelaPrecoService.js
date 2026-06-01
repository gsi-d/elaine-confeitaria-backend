const prisma = require('../config/prisma');

async function getAllTabelasPreco() {
  return prisma.tabelaPreco.findMany();
}

async function getTabelaPrecoById(id) {
  const tabela = await prisma.tabelaPreco.findUnique({ where: { id } });

  if (!tabela) {
    const error = new Error('Tabela de preço não encontrada');
    error.statusCode = 404;
    throw error;
  }

  return tabela;
}

async function createTabelaPreco(data) {
  return prisma.tabelaPreco.create({ data });
}

async function updateTabelaPreco(id, data) {
  try {
    return await prisma.tabelaPreco.update({
      where: { id },
      data,
    });
  } catch (error) {
    if (error.code === 'P2025') {
      const notFoundError = new Error('Tabela de preço não encontrada');
      notFoundError.statusCode = 404;
      throw notFoundError;
    }

    throw error;
  }
}

async function deleteTabelaPreco(id) {
  try {
    await prisma.tabelaPreco.delete({ where: { id } });
  } catch (error) {
    if (error.code === 'P2025') {
      const notFoundError = new Error('Tabela de preço não encontrada');
      notFoundError.statusCode = 404;
      throw notFoundError;
    }

    throw error;
  }
}

module.exports = {
  getAllTabelasPreco,
  getTabelaPrecoById,
  createTabelaPreco,
  updateTabelaPreco,
  deleteTabelaPreco,
};

