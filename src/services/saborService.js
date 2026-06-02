const { createCatalogService } = require('./catalogService');
const { createInMemoryCatalogRepository } = require('../repositories/inMemoryCatalogRepository');

const saborService = createCatalogService(
  createInMemoryCatalogRepository('sabores'),
  'Sabor não encontrado',
);

module.exports = saborService;
