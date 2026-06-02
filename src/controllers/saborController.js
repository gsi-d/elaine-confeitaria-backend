const saborService = require('../services/saborService');
const { createCatalogController } = require('./catalogControllerFactory');

module.exports = createCatalogController({
  getAll: saborService.getAll,
  getById: saborService.getById,
});
