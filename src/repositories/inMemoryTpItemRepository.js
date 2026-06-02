const { store, hydrateTpItem } = require('../data/inMemoryStore');

function createInMemoryTpItemRepository() {
  return {
    async findMany() {
      return store.tpItems.map((item) => hydrateTpItem(item));
    },

    async findById(id) {
      const item = store.tpItems.find((entry) => entry.id === id) || null;
      return hydrateTpItem(item);
    },
  };
}

module.exports = {
  createInMemoryTpItemRepository,
  inMemoryTpItemRepository: createInMemoryTpItemRepository(),
};
