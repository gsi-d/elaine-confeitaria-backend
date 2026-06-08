const prismaClient = require('../config/prisma');

const pedidoInclude = {
  usuario: {
    select: {
      id: true,
      email: true,
    },
  },
  itens: {
    include: {
      produto: true,
    },
    orderBy: {
      id: 'asc',
    },
  },
};

function normalizeCreateData(data) {
  return {
    ...data,
    anexo: data.anexo || [],
  };
}

function createPrismaPedidoRepository(prisma = prismaClient) {
  return {
    findMany() {
      return prisma.pedido.findMany({
        include: pedidoInclude,
        orderBy: { id: 'asc' },
      });
    },

    findManyByUsuarioId(usuarioId) {
      return prisma.pedido.findMany({
        where: { usuarioId },
        include: pedidoInclude,
        orderBy: { id: 'asc' },
      });
    },

    findById(id) {
      return prisma.pedido.findUnique({
        where: { id },
        include: pedidoInclude,
      });
    },

    findByIdAndUsuarioId(id, usuarioId) {
      return prisma.pedido.findFirst({
        where: { id, usuarioId },
        include: pedidoInclude,
      });
    },

    create(data) {
      return prisma.pedido.create({
        data: normalizeCreateData(data),
        include: pedidoInclude,
      });
    },

    async update(id, usuarioId, data) {
      const currentPedido = await prisma.pedido.findFirst({
        where: { id, usuarioId },
        select: { id: true },
      });

      if (!currentPedido) {
        return null;
      }

      return prisma.pedido.update({
        where: { id },
        data,
        include: pedidoInclude,
      });
    },

    async delete(id, usuarioId) {
      const currentPedido = await prisma.pedido.findFirst({
        where: { id, usuarioId },
        select: { id: true },
      });

      if (!currentPedido) {
        return false;
      }

      await prisma.pedido.delete({
        where: { id },
      });

      return true;
    },
  };
}

module.exports = {
  createPrismaPedidoRepository,
  prismaPedidoRepository: createPrismaPedidoRepository(),
};
