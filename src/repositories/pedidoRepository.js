const {
  createInMemoryPedidoRepository,
  inMemoryPedidoRepository,
} = require('./inMemoryPedidoRepository');

module.exports = {
  createPedidoRepository: createInMemoryPedidoRepository,
  pedidoRepository: inMemoryPedidoRepository,
};
