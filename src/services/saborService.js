const prisma = require('../config/prisma');

async function getAllSabores() {
  return prisma.sabor.findMany();
}

async function getSaborById(id) {
  const sabor = await prisma.sabor.findUnique({ where: { id } });

  if (!sabor) {
    const error = new Error('Sabor não encontrado');
    error.statusCode = 404;
    throw error;
  }

  return sabor;
}

async function createSabor(data) {
  return prisma.sabor.create({ data });
}

async function updateSabor(id, data) {
  try {
    return await prisma.sabor.update({
      where: { id },
      data,
    });
  } catch (error) {
    if (error.code === 'P2025') {
      const notFoundError = new Error('Sabor não encontrado');
      notFoundError.statusCode = 404;
      throw notFoundError;
    }

    throw error;
  }
}

async function deleteSabor(id) {
  try {
    await prisma.sabor.delete({ where: { id } });
  } catch (error) {
    if (error.code === 'P2025') {
      const notFoundError = new Error('Sabor não encontrado');
      notFoundError.statusCode = 404;
      throw notFoundError;
    }

    throw error;
  }
}

module.exports = {
  getAllSabores,
  getSaborById,
  createSabor,
  updateSabor,
  deleteSabor,
};

