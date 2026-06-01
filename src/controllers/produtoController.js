const produtoService = require('../services/produtoService');

async function getAll(request, response, next) {
  try {
    const produtos = await produtoService.getAllProdutos();
    response.json(produtos);
  } catch (error) {
    next(error);
  }
}

async function getById(request, response, next) {
  try {
    const id = Number(request.params.id);
    const produto = await produtoService.getProdutoById(id);
    response.json(produto);
  } catch (error) {
    next(error);
  }
}

async function create(request, response, next) {
  try {
    const produto = await produtoService.createProduto(request.body);
    response.status(201).json(produto);
  } catch (error) {
    next(error);
  }
}

async function update(request, response, next) {
  try {
    const id = Number(request.params.id);
    const produto = await produtoService.updateProduto(id, request.body);
    response.json(produto);
  } catch (error) {
    next(error);
  }
}

async function remove(request, response, next) {
  try {
    const id = Number(request.params.id);
    await produtoService.deleteProduto(id);
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

