const pedidoService = require('../services/pedidoService');

async function getAll(request, response, next) {
  try {
    const pedidos = await pedidoService.getAllPedidos();
    response.json(pedidos);
  } catch (error) {
    next(error);
  }
}

async function getById(request, response, next) {
  try {
    const id = Number(request.params.id);
    const pedido = await pedidoService.getPedidoById(id);
    response.json(pedido);
  } catch (error) {
    next(error);
  }
}

async function create(request, response, next) {
  try {
    const pedido = await pedidoService.createPedido(request.body);
    response.status(201).json(pedido);
  } catch (error) {
    next(error);
  }
}

async function update(request, response, next) {
  try {
    const id = Number(request.params.id);
    const pedido = await pedidoService.updatePedido(id, request.body);
    response.json(pedido);
  } catch (error) {
    next(error);
  }
}

async function remove(request, response, next) {
  try {
    const id = Number(request.params.id);
    await pedidoService.deletePedido(id);
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

