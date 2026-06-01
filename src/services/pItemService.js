const prisma = require('../config/prisma');

async function getAllPItems() {
  return prisma.pItem.findMany();
}

async function getPItemById(id) {
  const item = await prisma.pItem.findUnique({ where: { id } });

  if (!item) {
    const error = new Error('Item de pedido não encontrado');
    error.statusCode = 404;
    throw error;
  }

  return item;
}

async function createPItem(data) {
  return prisma.pItem.create({ data });
}

async function updatePItem(id, data) {
  try {
    return await prisma.pItem.update({
      where: { id },
      data,
    });
  } catch (error) {
    if (error.code === 'P2025') {
      const notFoundError = new Error('Item de pedido não encontrado');
      notFoundError.statusCode = 404;
      throw notFoundError;
    }

    throw error;
  }
}

async function deletePItem(id) {
  try {
    await prisma.pItem.delete({ where: { id } });
  } catch (error) {
    if (error.code === 'P2025') {
      const notFoundError = new Error('Item de pedido não encontrado');
      notFoundError.statusCode = 404;
      throw notFoundError;
    }

    throw error;
  }
}

module.exports = {
  getAllPItems,
  getPItemById,
  createPItem,
  updatePItem,
  deletePItem,
};

