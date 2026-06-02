const authService = require('../services/authService');
const { validateLoginPayload } = require('../validators/authValidator');

function createAuthController(dependencies = {}) {
  const { service = authService } = dependencies;

  return {
    async login(request, response, next) {
      try {
        const { email, senha } = validateLoginPayload(request.body);
        const result = await service.login(email, senha);
        response.json(result);
      } catch (error) {
        next(error);
      }
    },
  };
}

module.exports = {
  createAuthController,
  ...createAuthController(),
};
