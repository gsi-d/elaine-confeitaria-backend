const { createHttpError } = require('../errors/httpError');

const DELIVERY_TYPES = new Set(['ENTREGA', 'RETIRADA']);
const ORDER_STATUS = new Set(['PENDENTE', 'EM_PREPARO', 'FINALIZADO', 'CANCELADO']);

function normalizeString(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function normalizeItens(itens) {
  if (!Array.isArray(itens) || itens.length === 0) {
    throw createHttpError(400, 'Pedido deve ter ao menos um item');
  }

  return itens.map((item, index) => {
    const produtoId = Number(item?.produtoId);
    const quantidade = Number(item?.quantidade);

    if (!Number.isInteger(produtoId) || produtoId <= 0) {
      throw createHttpError(400, `Item ${index + 1} com produto inválido`);
    }

    if (!Number.isInteger(quantidade) || quantidade <= 0) {
      throw createHttpError(400, `Item ${index + 1} com quantidade inválida`);
    }

    return {
      produtoId,
      quantidade,
    };
  });
}

function normalizeDesconto(desconto) {
  if (desconto === undefined || desconto === null || desconto === '') {
    return 0;
  }

  const parsed = Number(desconto);

  if (Number.isNaN(parsed) || parsed < 0) {
    throw createHttpError(400, 'Desconto inválido');
  }

  return parsed;
}

function normalizeTipoEntrega(tipoEntrega) {
  const normalized = normalizeString(tipoEntrega).toUpperCase();

  if (!DELIVERY_TYPES.has(normalized)) {
    throw createHttpError(400, 'Tipo de entrega inválido');
  }

  return normalized;
}

function validateCreatePedidoPayload(payload) {
  if (!payload || typeof payload !== 'object') {
    throw createHttpError(400, 'Payload de pedido inválido');
  }

  const endereco = normalizeString(payload.endereco);
  const tipoEntrega = normalizeTipoEntrega(payload.tipoEntrega);
  const itens = normalizeItens(payload.itens);
  const desconto = normalizeDesconto(payload.desconto);

  if (tipoEntrega === 'ENTREGA' && !endereco) {
    throw createHttpError(400, 'Endereço é obrigatório para entrega');
  }

  return {
    endereco,
    tipoEntrega,
    desconto,
    itens,
  };
}

function validateUpdatePedidoPayload(payload) {
  if (!payload || typeof payload !== 'object') {
    throw createHttpError(400, 'Payload de atualização inválido');
  }

  const normalized = {};

  if (payload.endereco !== undefined) {
    normalized.endereco = normalizeString(payload.endereco);
  }

  if (payload.tipoEntrega !== undefined) {
    normalized.tipoEntrega = normalizeTipoEntrega(payload.tipoEntrega);
  }

  if (payload.desconto !== undefined) {
    normalized.desconto = normalizeDesconto(payload.desconto);
  }

  if (payload.status !== undefined) {
    const status = normalizeString(payload.status).toUpperCase();

    if (!ORDER_STATUS.has(status)) {
      throw createHttpError(400, 'Status do pedido inválido');
    }

    normalized.status = status;
  }

  if (payload.itens !== undefined) {
    normalized.itens = normalizeItens(payload.itens);
  }

  if (Object.keys(normalized).length === 0) {
    throw createHttpError(400, 'Nenhum campo válido informado para atualização');
  }

  if (
    normalized.tipoEntrega === 'ENTREGA' &&
    normalized.endereco !== undefined &&
    !normalized.endereco
  ) {
    throw createHttpError(400, 'Endereço é obrigatório para entrega');
  }

  return normalized;
}

module.exports = {
  DELIVERY_TYPES,
  ORDER_STATUS,
  validateCreatePedidoPayload,
  validateUpdatePedidoPayload,
};
