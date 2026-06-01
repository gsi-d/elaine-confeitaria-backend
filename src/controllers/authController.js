const authService = require('../services/authService');

async function login(request, response, next) {
  try {
    const { email, senha } = request.body;

    if (!email || !senha) {
      const error = new Error('Email e senha são obrigatórios');
      error.statusCode = 400;
      throw error;
    }

    const result = await authService.login(email, senha);
    response.json(result);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  login,
};

