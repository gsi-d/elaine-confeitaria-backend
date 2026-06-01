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

async function create(request, response, next) {
  try {
    const tabela = await tabelaPrecoService.createTabelaPreco(request.body);
    response.status(201).json(tabela);
  } catch (error) {
    next(error);
  }
}

async function update(request, response, next) {
  try {
    const id = Number(request.params.id);
    const tabela = await tabelaPrecoService.updateTabelaPreco(id, request.body);
    response.json(tabela);
  } catch (error) {
    next(error);
  }
}

async function remove(request, response, next) {
  try {
    const id = Number(request.params.id);
    await tabelaPrecoService.deleteTabelaPreco(id);
    response.status(204).send();
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove,
};

