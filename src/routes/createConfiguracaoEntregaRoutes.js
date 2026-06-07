const express = require('express');
const requireAdmin = require('../middlewares/requireAdmin');

function createConfiguracaoEntregaRoutes(configuracaoEntregaController) {
  const router = express.Router();

  router.get('/', configuracaoEntregaController.get);
  router.put('/', requireAdmin, configuracaoEntregaController.update);

  return router;
}

module.exports = createConfiguracaoEntregaRoutes;
