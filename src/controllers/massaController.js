const massaService = require('../services/massaService');
const { createCatalogController } = require('./catalogControllerFactory');

module.exports = createCatalogController({
  getAll: massaService.getAll,
  getById: massaService.getById,
});
