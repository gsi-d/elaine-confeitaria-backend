const pedidoService = require('../services/pedidoService');
const { createHttpError } = require('../errors/httpError');

function parseId(id) {
  const parsedId = Number(id);

  if (!Number.isInteger(parsedId) || parsedId <= 0) {
    throw createHttpError(400, 'Identificador de pedido inválido');
  }

  return parsedId;
}

function createPedidoController(dependencies = {}) {
  const { service = pedidoService } = dependencies;

  return {
    async getAll(request, response, next) {
      try {
        const pedidos = await service.getAllPedidos(request.user.id);
        response.json(pedidos);
      } catch (error) {
        next(error);
      }
    },

    async getById(request, response, next) {
      try {
        const id = parseId(request.params.id);
        const pedido = await service.getPedidoById(id, request.user.id);
        response.json(pedido);
      } catch (error) {
        next(error);
      }
    },

    async create(request, response, next) {
      try {
        const pedido = await service.createPedido(request.user.id, request.body);
        response.status(201).json(pedido);
      } catch (error) {
        next(error);
      }
    },

    async update(request, response, next) {
      try {
        const id = parseId(request.params.id);
        const pedido = await service.updatePedido(id, request.user.id, request.body);
        response.json(pedido);
      } catch (error) {
        next(error);
      }
    },

    async remove(request, response, next) {
      try {
        const id = parseId(request.params.id);
        await service.deletePedido(id, request.user.id);
        response.status(204).send();
      } catch (error) {
        next(error);
      }
    },
  };
}

module.exports = {
  createPedidoController,
  ...createPedidoController(),
};
