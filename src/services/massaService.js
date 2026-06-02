const { createCatalogService } = require('./catalogService');
const { createInMemoryCatalogRepository } = require('../repositories/inMemoryCatalogRepository');

const massaService = createCatalogService(
  createInMemoryCatalogRepository('massas'),
  'Massa não encontrada',
);

module.exports = massaService;
