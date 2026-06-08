const prismaClient = require('../config/prisma');

function createPrismaCatalogRepository(modelName, prisma = prismaClient) {
  const delegate = prisma[modelName];

  return {
    findMany() {
      return delegate.findMany({
        orderBy: { id: 'asc' },
      });
    },

    findById(id) {
      return delegate.findUnique({
        where: { id },
      });
    },
  };
}

module.exports = {
  createPrismaCatalogRepository,
};
