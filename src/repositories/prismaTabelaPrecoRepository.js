const prismaClient = require('../config/prisma');

function createPrismaTabelaPrecoRepository(prisma = prismaClient) {
  return {
    findMany() {
      return prisma.tabelaPreco.findMany({
        include: {
          itens: {
            include: {
              produto: true,
            },
            orderBy: { id: 'asc' },
          },
        },
        orderBy: {
          dataInicio: 'desc',
        },
      });
    },

    findById(id) {
      return prisma.tabelaPreco.findUnique({
        where: { id },
        include: {
          itens: {
            include: {
              produto: true,
            },
            orderBy: { id: 'asc' },
          },
        },
      });
    },
  };
}

module.exports = {
  createPrismaTabelaPrecoRepository,
  prismaTabelaPrecoRepository: createPrismaTabelaPrecoRepository(),
};
