const { createCatalogService } = require('./catalogService');
const { createInMemoryCatalogRepository } = require('../repositories/inMemoryCatalogRepository');

const produtoService = createCatalogService(
  createInMemoryCatalogRepository('produtos'),
  'Produto não encontrado',
);

module.exports = produtoService;
