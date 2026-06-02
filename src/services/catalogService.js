const { createHttpError } = require('../errors/httpError');

function createCatalogService(repository, notFoundMessage) {
  return {
    async getAll() {
      return repository.findMany();
    },

    async getById(id) {
      const item = await repository.findById(id);

      if (!item) {
        throw createHttpError(404, notFoundMessage);
      }

      return item;
    },
  };
}

module.exports = {
  createCatalogService,
};
