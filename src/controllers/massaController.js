const massaService = require('../services/massaService');

async function getAll(request, response, next) {
  try {
    const massas = await massaService.getAllMassas();
    response.json(massas);
  } catch (error) {
    next(error);
  }
}

async function getById(request, response, next) {
  try {
    const id = Number(request.params.id);
    const massa = await massaService.getMassaById(id);
    response.json(massa);
  } catch (error) {
    next(error);
  }
}

async function create(request, response, next) {
  try {
    const massa = await massaService.createMassa(request.body);
    response.status(201).json(massa);
  } catch (error) {
    next(error);
  }
}

async function update(request, response, next) {
  try {
    const id = Number(request.params.id);
    const massa = await massaService.updateMassa(id, request.body);
    response.json(massa);
  } catch (error) {
    next(error);
  }
}

async function remove(request, response, next) {
  try {
    const id = Number(request.params.id);
    await massaService.deleteMassa(id);
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

