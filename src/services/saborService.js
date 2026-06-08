const { createCatalogService } = require('./catalogService');
const { createInMemoryCatalogRepository } = require('../repositories/inMemoryCatalogRepository');
const { createPrismaCatalogRepository } = require('../repositories/prismaCatalogRepository');
const { isPrismaPersistenceEnabled } = require('../config/persistence');

const saborService = createCatalogService(
  isPrismaPersistenceEnabled()
    ? createPrismaCatalogRepository('sabor')
    : createInMemoryCatalogRepository('sabores'),
  'Sabor não encontrado',
);

module.exports = saborService;
