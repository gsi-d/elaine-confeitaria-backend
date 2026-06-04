const path = require('path');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

require('./config/env');

const { createServices } = require('./container');
const globalMiddleware = require('./middlewares/globalMiddleware');
const authMiddleware = require('./middlewares/authMiddleware');
const errorHandler = require('./middlewares/errorHandler');

const { createAuthController } = require('./controllers/authController');
const { createPedidoController } = require('./controllers/pedidoController');
const createAuthRoutes = require('./routes/createAuthRoutes');
const createPedidoRoutes = require('./routes/createPedidoRoutes');
const produtoRoutes = require('./routes/produtoRoutes');
const massaRoutes = require('./routes/massaRoutes');
const saborRoutes = require('./routes/saborRoutes');
const usuarioRoutes = require('./routes/usuarioRoutes');
const tabelaPrecoRoutes = require('./routes/tabelaPrecoRoutes');
const tpItemRoutes = require('./routes/tpItemRoutes');

function createApp(serviceOverrides = {}) {
  const services = createServices(serviceOverrides);
  const authController = createAuthController({ service: services.authService });
  const pedidoController = createPedidoController({ service: services.pedidoService });

  const app = express();

  app.disable('x-powered-by');

  app.use(helmet());
  app.use(cors());
  app.use(express.json());
  app.use(morgan('dev'));
  app.use('/assets', express.static(path.join(__dirname, '..', 'public', 'assets')));

  app.use(globalMiddleware);

  app.use('/auth', createAuthRoutes(authController));

  app.use(authMiddleware);

  app.use('/produtos', produtoRoutes);
  app.use('/massas', massaRoutes);
  app.use('/sabores', saborRoutes);
  app.use('/usuarios', usuarioRoutes);
  app.use('/tabelas-preco', tabelaPrecoRoutes);
  app.use('/tp-itens', tpItemRoutes);
  app.use('/pedidos', createPedidoRoutes(pedidoController));

  app.use(errorHandler);

  return app;
}

const app = createApp();

module.exports = app;
module.exports.createApp = createApp;
