const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

require('./config/env');

const globalMiddleware = require('./middlewares/globalMiddleware');
const authMiddleware = require('./middlewares/authMiddleware');
const errorHandler = require('./middlewares/errorHandler');

const authRoutes = require('./routes/authRoutes');
const produtoRoutes = require('./routes/produtoRoutes');
const massaRoutes = require('./routes/massaRoutes');
const saborRoutes = require('./routes/saborRoutes');
const usuarioRoutes = require('./routes/usuarioRoutes');
const tabelaPrecoRoutes = require('./routes/tabelaPrecoRoutes');
const tpItemRoutes = require('./routes/tpItemRoutes');
const pedidoRoutes = require('./routes/pedidoRoutes');
const pItemRoutes = require('./routes/pItemRoutes');

const app = express();

app.disable('x-powered-by');

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.use(globalMiddleware);

app.use('/auth', authRoutes);

app.use(authMiddleware);

app.use('/produtos', produtoRoutes);
app.use('/massas', massaRoutes);
app.use('/sabores', saborRoutes);
app.use('/usuarios', usuarioRoutes);
app.use('/tabelas-preco', tabelaPrecoRoutes);
app.use('/tp-itens', tpItemRoutes);
app.use('/pedidos', pedidoRoutes);
app.use('/p-itens', pItemRoutes);

app.use(errorHandler);

module.exports = app;

