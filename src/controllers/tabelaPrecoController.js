const tabelaPrecoService = require('../services/tabelaPrecoService');

async function getAll(request, response, next) {
  try {
    const tabelas = await tabelaPrecoService.getAllTabelasPreco();
    response.json(tabelas);
  } catch (error) {
    next(error);
  }
}

async function getById(request, response, next) {
  try {
    const id = Number(request.params.id);
    const tabela = await tabelaPrecoService.getTabelaPrecoById(id);
    response.json(tabela);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getAll,
  getById,
};
