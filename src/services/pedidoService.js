const { createHttpError } = require('../errors/httpError');
const { pedidoRepository } = require('../repositories/pedidoRepository');
const { precoRepository } = require('../repositories/precoRepository');
const {
  validateCreatePedidoPayload,
  validateUpdatePedidoPayload,
} = require('../validators/pedidoValidator');

async function hydrateItens(itens, priceLookupRepository) {
  const hydratedItems = [];

  for (const item of itens) {
    const activePrice = await priceLookupRepository.findActivePriceByProductId(item.produtoId);

    if (!activePrice) {
      throw createHttpError(
        400,
        `Produto ${item.produtoId} não possui preço ativo para pedido`,
      );
    }

    hydratedItems.push({
      produtoId: item.produtoId,
      quantidade: item.quantidade,
      preco: activePrice.preco,
      produto: activePrice.produto,
    });
  }

  return hydratedItems;
}

function calculateTotals(itens, desconto) {
  const subtotal = itens.reduce((total, item) => total + item.preco * item.quantidade, 0);

  if (desconto > subtotal) {
    throw createHttpError(400, 'Desconto não pode ser maior que o subtotal do pedido');
  }

  return {
    subtotal,
    valorTotal: Number((subtotal - desconto).toFixed(2)),
  };
}

function serializePedidoInput(usuarioId, data, itens) {
  return {
    usuarioId,
    endereco: data.endereco,
    tipoEntrega: data.tipoEntrega,
    desconto: data.desconto,
    status: data.status || 'PENDENTE',
    valorTotal: data.valorTotal,
    itens: {
      create: itens.map((item) => ({
        produtoId: item.produtoId,
        quantidade: item.quantidade,
        preco: item.preco,
      })),
    },
  };
}

function createPedidoService(dependencies = {}) {
  const {
    repository = pedidoRepository,
    priceLookupRepository = precoRepository,
  } = dependencies;

  return {
    getAllPedidos(usuarioId) {
      return repository.findManyByUsuarioId(usuarioId);
    },

    async getPedidoById(id, usuarioId) {
      const pedido = await repository.findByIdAndUsuarioId(id, usuarioId);

      if (!pedido) {
        throw createHttpError(404, 'Pedido não encontrado');
      }

      return pedido;
    },

    async createPedido(usuarioId, payload) {
      const validatedPayload = validateCreatePedidoPayload(payload);
      const pricedItems = await hydrateItens(validatedPayload.itens, priceLookupRepository);
      const totals = calculateTotals(pricedItems, validatedPayload.desconto);

      return repository.create(
        serializePedidoInput(
          usuarioId,
          {
            ...validatedPayload,
            ...totals,
            status: 'PENDENTE',
          },
          pricedItems,
        ),
      );
    },

    async updatePedido(id, usuarioId, payload) {
      const validatedPayload = validateUpdatePedidoPayload(payload);
      const currentPedido = await repository.findByIdAndUsuarioId(id, usuarioId);

      if (!currentPedido) {
        throw createHttpError(404, 'Pedido não encontrado');
      }

      let nextItens = currentPedido.itens.map((item) => ({
        produtoId: item.produtoId,
        quantidade: item.quantidade,
        preco: item.preco,
      }));

      if (validatedPayload.itens) {
        nextItens = await hydrateItens(validatedPayload.itens, priceLookupRepository);
      }

      const desconto =
        validatedPayload.desconto !== undefined
          ? validatedPayload.desconto
          : Number(currentPedido.desconto || 0);

      const totals = calculateTotals(nextItens, desconto);
      const updateData = {
        endereco:
          validatedPayload.endereco !== undefined
            ? validatedPayload.endereco
            : currentPedido.endereco,
        tipoEntrega: validatedPayload.tipoEntrega || currentPedido.tipoEntrega,
        desconto,
        status: validatedPayload.status || currentPedido.status,
        valorTotal: totals.valorTotal,
      };

      if (updateData.tipoEntrega === 'ENTREGA' && !updateData.endereco) {
        throw createHttpError(400, 'Endereço é obrigatório para entrega');
      }

      if (validatedPayload.itens) {
        updateData.itens = {
          deleteMany: {},
          create: nextItens.map((item) => ({
            produtoId: item.produtoId,
            quantidade: item.quantidade,
            preco: item.preco,
          })),
        };
      }

      const updatedPedido = await repository.update(id, usuarioId, updateData);

      if (!updatedPedido) {
        throw createHttpError(404, 'Pedido não encontrado');
      }

      return updatedPedido;
    },

    async deletePedido(id, usuarioId) {
      const deleted = await repository.delete(id, usuarioId);

      if (!deleted) {
        throw createHttpError(404, 'Pedido não encontrado');
      }
    },
  };
}

module.exports = {
  createPedidoService,
  ...createPedidoService(),
  calculateTotals,
  hydrateItens,
};
