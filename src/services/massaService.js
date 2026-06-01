const prisma = require('../config/prisma');

async function getAllMassas() {
  return prisma.massa.findMany();
}

async function getMassaById(id) {
  const massa = await prisma.massa.findUnique({ where: { id } });

  if (!massa) {
    const error = new Error('Massa não encontrada');
    error.statusCode = 404;
    throw error;
  }

  return massa;
}

async function createMassa(data) {
  return prisma.massa.create({ data });
}

async function updateMassa(id, data) {
  try {
    return await prisma.massa.update({
      where: { id },
      data,
    });
  } catch (error) {
    if (error.code === 'P2025') {
      const notFoundError = new Error('Massa não encontrada');
      notFoundError.statusCode = 404;
      throw notFoundError;
    }

    throw error;
  }
}

async function deleteMassa(id) {
  try {
    await prisma.massa.delete({ where: { id } });
  } catch (error) {
    if (error.code === 'P2025') {
      const notFoundError = new Error('Massa não encontrada');
      notFoundError.statusCode = 404;
      throw notFoundError;
    }

    throw error;
  }
}

module.exports = {
  getAllMassas,
  getMassaById,
  createMassa,
  updateMassa,
  deleteMassa,
};

