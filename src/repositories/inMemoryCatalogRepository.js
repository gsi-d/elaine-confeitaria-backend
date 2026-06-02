const { store, clone } = require('../data/inMemoryStore');

function createInMemoryCatalogRepository(collectionName) {
  return {
    async findMany() {
      return clone(store[collectionName]);
    },

    async findById(id) {
      const item = store[collectionName].find((entry) => entry.id === id) || null;
      return clone(item);
    },
  };
}

module.exports = {
  createInMemoryCatalogRepository,
};
