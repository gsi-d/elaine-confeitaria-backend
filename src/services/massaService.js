const { createCatalogService } = require('./catalogService');
const { createInMemoryCatalogRepository } = require('../repositories/inMemoryCatalogRepository');
const { createPrismaCatalogRepository } = require('../repositories/prismaCatalogRepository');
const { isPrismaPersistenceEnabled } = require('../config/persistence');

const massaService = createCatalogService(
  isPrismaPersistenceEnabled()
    ? createPrismaCatalogRepository('massa')
    : createInMemoryCatalogRepository('massas'),
  'Massa não encontrada',
);

module.exports = massaService;
