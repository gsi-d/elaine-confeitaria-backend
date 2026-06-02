const pedidoController = require('../controllers/pedidoController');
const createPedidoRoutes = require('./createPedidoRoutes');

module.exports = createPedidoRoutes(pedidoController);
