const { createHttpError } = require('../errors/httpError');

const DELIVERY_TYPES = new Set(['ENTREGA', 'RETIRADA']);
const ORDER_STATUS = new Set([
  'EM_ABERTO',
  'EM_PREPARO',
  'SAIU_PARA_ENTREGA',
  'PRONTO_PARA_RETIRADA',
  'FINALIZADO',
  'CANCELADO',
]);

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

function normalizeAnexo(anexo) {
  if (anexo === undefined) {
    return undefined;
  }

  if (!Array.isArray(anexo)) {
    throw createHttpError(400, 'Anexo deve ser um array');
  }

  return anexo;
}

function normalizeTipoEntrega(tipoEntrega) {
  const normalized = normalizeString(tipoEntrega).toUpperCase();

  if (!DELIVERY_TYPES.has(normalized)) {
    throw createHttpError(400, 'Tipo de entrega inválido');
  }

  return normalized;
}

function normalizeOptionalString(value) {
  if (value === undefined) {
    return undefined;
  }

  return normalizeString(value);
}

function validateCreatePedidoPayload(payload) {
  if (!payload || typeof payload !== 'object') {
    throw createHttpError(400, 'Payload de pedido inválido');
  }

  const endereco = normalizeString(payload.endereco);
  const tipoEntrega = normalizeTipoEntrega(payload.tipoEntrega);
  const itens = normalizeItens(payload.itens);
  const desconto = normalizeDesconto(payload.desconto);
  const anexo = normalizeAnexo(payload.anexo) || [];
  const nomeRecebedor = normalizeString(payload.nomeRecebedor);
  const complemento = normalizeOptionalString(payload.complemento) || '';
  const referencia = normalizeOptionalString(payload.referencia) || '';
  const melhorHorarioEntrega = normalizeString(payload.melhorHorarioEntrega);
  const observacoes = normalizeOptionalString(payload.observacoes) || '';

  if (tipoEntrega === 'ENTREGA') {
    if (!nomeRecebedor) {
      throw createHttpError(400, 'Nome de quem vai receber é obrigatório para entrega');
    }

    if (!endereco) {
      throw createHttpError(400, 'Endereço é obrigatório para entrega');
    }

    if (!melhorHorarioEntrega) {
      throw createHttpError(400, 'Melhor horário de entrega é obrigatório para entrega');
    }
  }

  return {
    nomeRecebedor,
    endereco,
    complemento,
    referencia,
    tipoEntrega,
    melhorHorarioEntrega,
    observacoes,
    desconto,
    itens,
    anexo,
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

  if (payload.nomeRecebedor !== undefined) {
    normalized.nomeRecebedor = normalizeString(payload.nomeRecebedor);
  }

  if (payload.complemento !== undefined) {
    normalized.complemento = normalizeOptionalString(payload.complemento);
  }

  if (payload.referencia !== undefined) {
    normalized.referencia = normalizeOptionalString(payload.referencia);
  }

  if (payload.tipoEntrega !== undefined) {
    normalized.tipoEntrega = normalizeTipoEntrega(payload.tipoEntrega);
  }

  if (payload.melhorHorarioEntrega !== undefined) {
    normalized.melhorHorarioEntrega = normalizeString(payload.melhorHorarioEntrega);
  }

  if (payload.observacoes !== undefined) {
    normalized.observacoes = normalizeOptionalString(payload.observacoes);
  }

  if (payload.desconto !== undefined) {
    normalized.desconto = normalizeDesconto(payload.desconto);
  }

  if (payload.anexo !== undefined) {
    normalized.anexo = normalizeAnexo(payload.anexo);
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

  if (
    normalized.tipoEntrega === 'ENTREGA' &&
    normalized.nomeRecebedor !== undefined &&
    !normalized.nomeRecebedor
  ) {
    throw createHttpError(400, 'Nome de quem vai receber é obrigatório para entrega');
  }

  if (
    normalized.tipoEntrega === 'ENTREGA' &&
    normalized.melhorHorarioEntrega !== undefined &&
    !normalized.melhorHorarioEntrega
  ) {
    throw createHttpError(400, 'Melhor horário de entrega é obrigatório para entrega');
  }

  return normalized;
}

function validateUpdatePedidoStatusPayload(payload) {
  if (!payload || typeof payload !== 'object') {
    throw createHttpError(400, 'Payload de atualização de status inválido');
  }

  const status = normalizeString(payload.status).toUpperCase();
  const hasUsuarioId = payload.usuarioId !== undefined && payload.usuarioId !== null && payload.usuarioId !== '';
  const usuarioId = hasUsuarioId ? Number(payload.usuarioId) : undefined;

  if (hasUsuarioId && (!Number.isInteger(usuarioId) || usuarioId <= 0)) {
    throw createHttpError(400, 'Usuário inválido para atualização de status');
  }

  if (!ORDER_STATUS.has(status)) {
    throw createHttpError(400, 'Status do pedido inválido');
  }

  return {
    usuarioId,
    status,
  };
}

module.exports = {
  DELIVERY_TYPES,
  ORDER_STATUS,
  validateCreatePedidoPayload,
  validateUpdatePedidoPayload,
  validateUpdatePedidoStatusPayload,
};
