const pItemService = require('../services/pItemService');

async function getAll(request, response, next) {
  try {
    const itens = await pItemService.getAllPItems();
    response.json(itens);
  } catch (error) {
    next(error);
  }
}

async function getById(request, response, next) {
  try {
    const id = Number(request.params.id);
    const item = await pItemService.getPItemById(id);
    response.json(item);
  } catch (error) {
    next(error);
  }
}

async function create(request, response, next) {
  try {
    const item = await pItemService.createPItem(request.body);
    response.status(201).json(item);
  } catch (error) {
    next(error);
  }
}

async function update(request, response, next) {
  try {
    const id = Number(request.params.id);
    const item = await pItemService.updatePItem(id, request.body);
    response.json(item);
  } catch (error) {
    next(error);
  }
}

async function remove(request, response, next) {
  try {
    const id = Number(request.params.id);
    await pItemService.deletePItem(id);
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

