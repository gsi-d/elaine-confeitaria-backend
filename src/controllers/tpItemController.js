const tpItemService = require('../services/tpItemService');

async function getAll(request, response, next) {
  try {
    const itens = await tpItemService.getAllTpItems();
    response.json(itens);
  } catch (error) {
    next(error);
  }
}

async function getById(request, response, next) {
  try {
    const id = Number(request.params.id);
    const item = await tpItemService.getTpItemById(id);
    response.json(item);
  } catch (error) {
    next(error);
  }
}

async function create(request, response, next) {
  try {
    const item = await tpItemService.createTpItem(request.body);
    response.status(201).json(item);
  } catch (error) {
    next(error);
  }
}

async function update(request, response, next) {
  try {
    const id = Number(request.params.id);
    const item = await tpItemService.updateTpItem(id, request.body);
    response.json(item);
  } catch (error) {
    next(error);
  }
}

async function remove(request, response, next) {
  try {
    const id = Number(request.params.id);
    await tpItemService.deleteTpItem(id);
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

