const produtoService = require('../services/produtoService');
const { createCatalogController } = require('./catalogControllerFactory');

module.exports = createCatalogController({
  getAll: produtoService.getAll,
  getById: produtoService.getById,
});
