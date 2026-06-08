const {
  createInMemoryPedidoRepository,
  inMemoryPedidoRepository,
} = require('./inMemoryPedidoRepository');
const {
  createPrismaPedidoRepository,
  prismaPedidoRepository,
} = require('./prismaPedidoRepository');
const { isPrismaPersistenceEnabled } = require('../config/persistence');

module.exports = {
  createPedidoRepository: isPrismaPersistenceEnabled()
    ? createPrismaPedidoRepository
    : createInMemoryPedidoRepository,
  pedidoRepository: isPrismaPersistenceEnabled()
    ? prismaPedidoRepository
    : inMemoryPedidoRepository,
};
