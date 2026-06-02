const { store, clone, nextId, persistStore } = require('../data/inMemoryStore');

function createInMemoryUsuarioRepository() {
  return {
    async findByEmail(email) {
      const usuario = store.usuarios.find((item) => item.email === email) || null;
      return clone(usuario);
    },

    async findMany() {
      return clone(store.usuarios);
    },

    async findById(id) {
      const usuario = store.usuarios.find((item) => item.id === id) || null;
      return clone(usuario);
    },

    async create(data) {
      const created = {
        id: nextId('usuario'),
        ...data,
      };

      store.usuarios.push(created);
      persistStore();
      return clone(created);
    },

    async update(id, data) {
      const index = store.usuarios.findIndex((item) => item.id === id);

      if (index === -1) {
        const error = new Error('Registro não encontrado');
        error.code = 'P2025';
        throw error;
      }

      store.usuarios[index] = {
        ...store.usuarios[index],
        ...data,
      };
      persistStore();

      return clone(store.usuarios[index]);
    },

    async delete(id) {
      const index = store.usuarios.findIndex((item) => item.id === id);

      if (index === -1) {
        const error = new Error('Registro não encontrado');
        error.code = 'P2025';
        throw error;
      }

      const [deleted] = store.usuarios.splice(index, 1);
      persistStore();
      return clone(deleted);
    },
  };
}

module.exports = {
  createInMemoryUsuarioRepository,
  inMemoryUsuarioRepository: createInMemoryUsuarioRepository(),
};
