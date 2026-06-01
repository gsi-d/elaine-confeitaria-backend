const saborService = require('../services/saborService');

async function getAll(request, response, next) {
  try {
    const sabores = await saborService.getAllSabores();
    response.json(sabores);
  } catch (error) {
    next(error);
  }
}

async function getById(request, response, next) {
  try {
    const id = Number(request.params.id);
    const sabor = await saborService.getSaborById(id);
    response.json(sabor);
  } catch (error) {
    next(error);
  }
}

async function create(request, response, next) {
  try {
    const sabor = await saborService.createSabor(request.body);
    response.status(201).json(sabor);
  } catch (error) {
    next(error);
  }
}

async function update(request, response, next) {
  try {
    const id = Number(request.params.id);
    const sabor = await saborService.updateSabor(id, request.body);
    response.json(sabor);
  } catch (error) {
    next(error);
  }
}

async function remove(request, response, next) {
  try {
    const id = Number(request.params.id);
    await saborService.deleteSabor(id);
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

