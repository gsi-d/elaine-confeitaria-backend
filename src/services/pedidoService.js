const prisma = require('../config/prisma');

async function getAllPedidos() {
  return prisma.pedido.findMany({
    include: {
      itens: true,
    },
  });
}

async function getPedidoById(id) {
  const pedido = await prisma.pedido.findUnique({
    where: { id },
    include: {
      itens: true,
    },
  });

  if (!pedido) {
    const error = new Error('Pedido não encontrado');
    error.statusCode = 404;
    throw error;
  }

  return pedido;
}

async function createPedido(data) {
  return prisma.pedido.create({ data });
}

async function updatePedido(id, data) {
  try {
    return await prisma.pedido.update({
      where: { id },
      data,
    });
  } catch (error) {
    if (error.code === 'P2025') {
      const notFoundError = new Error('Pedido não encontrado');
      notFoundError.statusCode = 404;
      throw notFoundError;
    }

    throw error;
  }
}

async function deletePedido(id) {
  try {
    await prisma.pedido.delete({ where: { id } });
  } catch (error) {
    if (error.code === 'P2025') {
      const notFoundError = new Error('Pedido não encontrado');
      notFoundError.statusCode = 404;
      throw notFoundError;
    }

    throw error;
  }
}

module.exports = {
  getAllPedidos,
  getPedidoById,
  createPedido,
  updatePedido,
  deletePedido,
};

