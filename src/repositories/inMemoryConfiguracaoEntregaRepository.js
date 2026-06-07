const { store, clone, persistStore } = require('../data/inMemoryStore');

function createInMemoryConfiguracaoEntregaRepository() {
  return {
    async get() {
      return clone(store.configuracaoEntrega);
    },

    async update(data) {
      store.configuracaoEntrega = {
        ...store.configuracaoEntrega,
        ...data,
      };

      persistStore();
      return clone(store.configuracaoEntrega);
    },
  };
}

module.exports = {
  createInMemoryConfiguracaoEntregaRepository,
  inMemoryConfiguracaoEntregaRepository: createInMemoryConfiguracaoEntregaRepository(),
};
