const { store, clone, findProdutoById, findTabelaPrecoById } = require('../data/inMemoryStore');

function createInMemoryPrecoRepository() {
  return {
    async findActivePriceByProductId(produtoId) {
      const activeTable = store.tabelasPreco.find((tabelaPreco) => tabelaPreco.atual);

      if (!activeTable) {
        return null;
      }

      const priceItem =
        store.tpItems.find(
          (item) => item.produtoId === produtoId && item.tabelaPrecoId === activeTable.id,
        ) || null;

      if (!priceItem) {
        return null;
      }

      return clone({
        ...priceItem,
        produto: findProdutoById(priceItem.produtoId),
        tabelaPreco: findTabelaPrecoById(priceItem.tabelaPrecoId),
      });
    },
  };
}

module.exports = {
  createInMemoryPrecoRepository,
  inMemoryPrecoRepository: createInMemoryPrecoRepository(),
};
