const express = require('express');

function createPedidoRoutes(pedidoController) {
  const router = express.Router();

  router.get('/', pedidoController.getAll);
  router.get('/:id', pedidoController.getById);
  router.post('/', pedidoController.create);
  router.put('/:id', pedidoController.update);
  router.delete('/:id', pedidoController.remove);

  return router;
}

module.exports = createPedidoRoutes;
