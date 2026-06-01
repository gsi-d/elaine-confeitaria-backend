const prisma = require('../config/prisma');

async function getAllTpItems() {
  return prisma.tPItem.findMany();
}

async function getTpItemById(id) {
  const item = await prisma.tPItem.findUnique({ where: { id } });

  if (!item) {
    const error = new Error('Item de tabela de preço não encontrado');
    error.statusCode = 404;
    throw error;
  }

  return item;
}

async function createTpItem(data) {
  return prisma.tPItem.create({ data });
}

async function updateTpItem(id, data) {
  try {
    return await prisma.tPItem.update({
      where: { id },
      data,
    });
  } catch (error) {
    if (error.code === 'P2025') {
      const notFoundError = new Error('Item de tabela de preço não encontrado');
      notFoundError.statusCode = 404;
      throw notFoundError;
    }

    throw error;
  }
}

async function deleteTpItem(id) {
  try {
    await prisma.tPItem.delete({ where: { id } });
  } catch (error) {
    if (error.code === 'P2025') {
      const notFoundError = new Error('Item de tabela de preço não encontrado');
      notFoundError.statusCode = 404;
      throw notFoundError;
    }

    throw error;
  }
}

module.exports = {
  getAllTpItems,
  getTpItemById,
  createTpItem,
  updateTpItem,
  deleteTpItem,
};

