const authServiceModule = require('./services/authService');
const pedidoServiceModule = require('./services/pedidoService');
const produtoService = require('./services/produtoService');
const massaService = require('./services/massaService');
const saborService = require('./services/saborService');
const usuarioService = require('./services/usuarioService');
const tabelaPrecoService = require('./services/tabelaPrecoService');
const tpItemService = require('./services/tpItemService');
const configuracaoEntregaService = require('./services/configuracaoEntregaService');

function createServices(overrides = {}) {
  return {
    authService: overrides.authService || authServiceModule,
    pedidoService: overrides.pedidoService || pedidoServiceModule,
    produtoService: overrides.produtoService || produtoService,
    massaService: overrides.massaService || massaService,
    saborService: overrides.saborService || saborService,
    usuarioService: overrides.usuarioService || usuarioService,
    tabelaPrecoService: overrides.tabelaPrecoService || tabelaPrecoService,
    tpItemService: overrides.tpItemService || tpItemService,
    configuracaoEntregaService: overrides.configuracaoEntregaService || configuracaoEntregaService,
  };
}

module.exports = {
  createServices,
};
