const prismaClient = require('../config/prisma');

function createPrismaTpItemRepository(prisma = prismaClient) {
  return {
    findMany() {
      return prisma.tPItem.findMany({
        include: {
          produto: true,
          tabelaPreco: true,
        },
        orderBy: { id: 'asc' },
      });
    },

    findById(id) {
      return prisma.tPItem.findUnique({
        where: { id },
        include: {
          produto: true,
          tabelaPreco: true,
        },
      });
    },
  };
}

module.exports = {
  createPrismaTpItemRepository,
  prismaTpItemRepository: createPrismaTpItemRepository(),
};
