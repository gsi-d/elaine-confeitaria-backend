const configuracaoEntregaService = require('../services/configuracaoEntregaService');

function createConfiguracaoEntregaController(dependencies = {}) {
  const { service = configuracaoEntregaService } = dependencies;

  return {
    async get(request, response, next) {
      try {
        const configuracao = await service.getConfiguracaoEntrega();
        response.json(configuracao);
      } catch (error) {
        next(error);
      }
    },

    async update(request, response, next) {
      try {
        const configuracao = await service.updateConfiguracaoEntrega(request.body, request.user.id);
        response.json(configuracao);
      } catch (error) {
        next(error);
      }
    },
  };
}

module.exports = {
  createConfiguracaoEntregaController,
  ...createConfiguracaoEntregaController(),
};
