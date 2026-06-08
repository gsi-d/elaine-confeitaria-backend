const fs = require('fs');
const path = require('path');

const { createHttpError } = require('../errors/httpError');
const { createInMemoryCatalogRepository } = require('../repositories/inMemoryCatalogRepository');
const { createPrismaCatalogRepository } = require('../repositories/prismaCatalogRepository');
const { isPrismaPersistenceEnabled } = require('../config/persistence');

const repository = isPrismaPersistenceEnabled()
  ? createPrismaCatalogRepository('produto')
  : createInMemoryCatalogRepository('produtos');
const ASSETS_ROOT = path.join(__dirname, '..', '..', 'public');

function resolveAssetPath(assetUrl) {
  if (typeof assetUrl !== 'string' || !assetUrl.startsWith('/assets/')) {
    return null;
  }

  return path.join(ASSETS_ROOT, assetUrl.replace(/^\/+/, '').replaceAll('/', path.sep));
}

function buildProdutoPayload(produto) {
  const assetPath = resolveAssetPath(produto.imagemUrl);
  let anexo = null;

  if (assetPath && fs.existsSync(assetPath)) {
    anexo = fs.readFileSync(assetPath).toString('base64');
  }

  return {
    ...produto,
    anexo,
  };
}

const produtoService = {
  async getAll() {
    const produtos = await repository.findMany();
    return produtos.map(buildProdutoPayload);
  },

  async getById(id) {
    const produto = await repository.findById(id);

    if (!produto) {
      throw createHttpError(404, 'Produto não encontrado');
    }

    return buildProdutoPayload(produto);
  },
};

module.exports = produtoService;
