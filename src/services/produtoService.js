const prisma = require('../config/prisma');

async function getAllProdutos() {
  return prisma.produto.findMany();
}

async function getProdutoById(id) {
  const produto = await prisma.produto.findUnique({ where: { id } });

  if (!produto) {
    const error = new Error('Produto não encontrado');
    error.statusCode = 404;
    throw error;
  }

  return produto;
}

async function createProduto(data) {
  return prisma.produto.create({ data });
}

async function updateProduto(id, data) {
  try {
    return await prisma.produto.update({
      where: { id },
      data,
    });
  } catch (error) {
    if (error.code === 'P2025') {
      const notFoundError = new Error('Produto não encontrado');
      notFoundError.statusCode = 404;
      throw notFoundError;
    }

    throw error;
  }
}

async function deleteProduto(id) {
  try {
    await prisma.produto.delete({ where: { id } });
  } catch (error) {
    if (error.code === 'P2025') {
      const notFoundError = new Error('Produto não encontrado');
      notFoundError.statusCode = 404;
      throw notFoundError;
    }

    throw error;
  }
}

module.exports = {
  getAllProdutos,
  getProdutoById,
  createProduto,
  updateProduto,
  deleteProduto,
};

