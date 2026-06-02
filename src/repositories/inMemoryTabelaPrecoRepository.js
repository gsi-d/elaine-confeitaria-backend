const { store, hydrateTabelaPreco } = require('../data/inMemoryStore');

function createInMemoryTabelaPrecoRepository() {
  return {
    async findMany() {
      return store.tabelasPreco
        .slice()
        .sort((a, b) => new Date(b.dataInicio).getTime() - new Date(a.dataInicio).getTime())
        .map((tabelaPreco) => hydrateTabelaPreco(tabelaPreco));
    },

    async findById(id) {
      const tabelaPreco = store.tabelasPreco.find((item) => item.id === id) || null;
      return hydrateTabelaPreco(tabelaPreco);
    },
  };
}

module.exports = {
  createInMemoryTabelaPrecoRepository,
  inMemoryTabelaPrecoRepository: createInMemoryTabelaPrecoRepository(),
};
