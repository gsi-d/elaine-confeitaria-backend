function createCatalogController(service) {
  return {
    async getAll(request, response, next) {
      try {
        const items = await service.getAll();
        response.json(items);
      } catch (error) {
        next(error);
      }
    },

    async getById(request, response, next) {
      try {
        const id = Number(request.params.id);
        const item = await service.getById(id);
        response.json(item);
      } catch (error) {
        next(error);
      }
    },
  };
}

module.exports = {
  createCatalogController,
};
