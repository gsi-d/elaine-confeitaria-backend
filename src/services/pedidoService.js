const { createHttpError } = require('../errors/httpError');
const { pedidoRepository } = require('../repositories/pedidoRepository');
const { precoRepository } = require('../repositories/precoRepository');
const { usuarioRepository } = require('../repositories/usuarioRepository');
const {
  validateCreatePedidoPayload,
  validateUpdatePedidoPayload,
  validateUpdatePedidoStatusPayload,
} = require('../validators/pedidoValidator');

const DEFAULT_ADMIN_EMAIL = 'cliente@elaine.com';

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
    nomeRecebedor: data.nomeRecebedor,
    endereco: data.endereco,
    complemento: data.complemento,
    referencia: data.referencia,
    tipoEntrega: data.tipoEntrega,
    melhorHorarioEntrega: data.melhorHorarioEntrega,
    observacoes: data.observacoes,
    anexo: data.anexo,
    desconto: data.desconto,
    status: data.status || 'EM_ABERTO',
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
    userRepository = usuarioRepository,
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
            status: 'EM_ABERTO',
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
        nomeRecebedor:
          validatedPayload.nomeRecebedor !== undefined
            ? validatedPayload.nomeRecebedor
            : currentPedido.nomeRecebedor,
        endereco:
          validatedPayload.endereco !== undefined
            ? validatedPayload.endereco
            : currentPedido.endereco,
        complemento:
          validatedPayload.complemento !== undefined
            ? validatedPayload.complemento
            : currentPedido.complemento,
        referencia:
          validatedPayload.referencia !== undefined
            ? validatedPayload.referencia
            : currentPedido.referencia,
        tipoEntrega: validatedPayload.tipoEntrega || currentPedido.tipoEntrega,
        melhorHorarioEntrega:
          validatedPayload.melhorHorarioEntrega !== undefined
            ? validatedPayload.melhorHorarioEntrega
            : currentPedido.melhorHorarioEntrega,
        observacoes:
          validatedPayload.observacoes !== undefined
            ? validatedPayload.observacoes
            : currentPedido.observacoes,
        anexo: validatedPayload.anexo !== undefined ? validatedPayload.anexo : currentPedido.anexo,
        desconto,
        status: validatedPayload.status || currentPedido.status,
        valorTotal: totals.valorTotal,
      };

      if (updateData.tipoEntrega === 'ENTREGA' && !updateData.endereco) {
        throw createHttpError(400, 'Endereço é obrigatório para entrega');
      }

      if (updateData.tipoEntrega === 'ENTREGA' && !updateData.nomeRecebedor) {
        throw createHttpError(400, 'Nome de quem vai receber é obrigatório para entrega');
      }

      if (updateData.tipoEntrega === 'ENTREGA' && !updateData.melhorHorarioEntrega) {
        throw createHttpError(400, 'Melhor horário de entrega é obrigatório para entrega');
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

    async updatePedidoStatus(id, payload) {
      const { usuarioId, status } = validateUpdatePedidoStatusPayload(payload);
      let effectiveUserId = usuarioId;

      if (!effectiveUserId) {
        const adminUser = await userRepository.findByEmail(DEFAULT_ADMIN_EMAIL);

        if (!adminUser) {
          throw createHttpError(500, `Usuário administrador padrão não encontrado: ${DEFAULT_ADMIN_EMAIL}`);
        }

        effectiveUserId = adminUser.id;
      }

      const updatedPedido = await repository.update(id, effectiveUserId, { status });

      if (!updatedPedido) {
        throw createHttpError(404, 'Pedido não encontrado');
      }

      return updatedPedido;
    },
  };
}

module.exports = {
  createPedidoService,
  ...createPedidoService(),
  calculateTotals,
  hydrateItens,
};
