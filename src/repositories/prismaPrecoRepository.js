const prismaClient = require('../config/prisma');

function createPrismaPrecoRepository(prisma = prismaClient) {
  return {
    findActivePriceByProductId(produtoId) {
      return prisma.tPItem.findFirst({
        where: {
          produtoId,
          tabelaPreco: {
            atual: true,
          },
        },
        include: {
          produto: true,
          tabelaPreco: true,
        },
        orderBy: {
          id: 'asc',
        },
      });
    },
  };
}

module.exports = {
  createPrismaPrecoRepository,
  prismaPrecoRepository: createPrismaPrecoRepository(),
};
