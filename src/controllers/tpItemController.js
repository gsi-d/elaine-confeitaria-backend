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

module.exports = {
  getAll,
  getById,
};
