const { store, nextId, hydratePedido, persistStore } = require('../data/inMemoryStore');

function createInMemoryPedidoRepository() {
  return {
    async findManyByUsuarioId(usuarioId) {
      return store.pedidos
        .filter((pedido) => pedido.usuarioId === usuarioId)
        .map((pedido) => hydratePedido(pedido));
    },

    async findByIdAndUsuarioId(id, usuarioId) {
      const pedido =
        store.pedidos.find((item) => item.id === id && item.usuarioId === usuarioId) || null;

      return hydratePedido(pedido);
    },

    async create(data) {
      const created = {
        id: nextId('pedido'),
        usuarioId: data.usuarioId,
        endereco: data.endereco,
        tipoEntrega: data.tipoEntrega,
        valorTotal: data.valorTotal,
        desconto: data.desconto,
        status: data.status,
        itens: data.itens.create.map((item) => ({
          id: nextId('pedidoItem'),
          produtoId: item.produtoId,
          quantidade: item.quantidade,
          preco: item.preco,
        })),
      };

      store.pedidos.push(created);
      persistStore();
      return hydratePedido(created);
    },

    async update(id, usuarioId, data) {
      const index = store.pedidos.findIndex(
        (pedido) => pedido.id === id && pedido.usuarioId === usuarioId,
      );

      if (index === -1) {
        return null;
      }

      const current = store.pedidos[index];

      const nextPedido = {
        ...current,
        ...data,
      };

      if (data.itens?.create) {
        nextPedido.itens = data.itens.create.map((item) => ({
          id: nextId('pedidoItem'),
          produtoId: item.produtoId,
          quantidade: item.quantidade,
          preco: item.preco,
        }));
      }

      delete nextPedido.itens?.deleteMany;

      store.pedidos[index] = nextPedido;
      persistStore();

      return hydratePedido(store.pedidos[index]);
    },

    async delete(id, usuarioId) {
      const index = store.pedidos.findIndex(
        (pedido) => pedido.id === id && pedido.usuarioId === usuarioId,
      );

      if (index === -1) {
        return false;
      }

      store.pedidos.splice(index, 1);
      persistStore();
      return true;
    },
  };
}

module.exports = {
  createInMemoryPedidoRepository,
  inMemoryPedidoRepository: createInMemoryPedidoRepository(),
};
