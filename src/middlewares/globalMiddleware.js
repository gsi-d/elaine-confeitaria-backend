function globalMiddleware(request, response, next) {
  const startTime = Date.now();

  response.on('finish', () => {
    const duration = Date.now() - startTime;
    const log = `[${new Date().toISOString()}] ${request.method} ${request.originalUrl} ${response.statusCode} - ${duration}ms`;
    console.log(log);
  });

  next();
}

module.exports = globalMiddleware;

