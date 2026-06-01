function errorHandler(error, request, response, next) {
  console.error(error);

  const statusCode = error.statusCode || 500;
  const message = error.message || 'Erro interno do servidor';

  response.status(statusCode).json({ message });
}

module.exports = errorHandler;

