const { createHttpError } = require('../errors/httpError');
const {
  inMemoryConfiguracaoEntregaRepository,
} = require('../repositories/inMemoryConfiguracaoEntregaRepository');

function normalizeInteger(value, fieldName) {
  const parsed = Number(value);

  if (!Number.isInteger(parsed) || parsed < 0) {
    throw createHttpError(400, `${fieldName} inválido`);
  }

  return parsed;
}

function normalizeMensagemLivre(value) {
  if (value === undefined) {
    return '';
  }

  if (typeof value !== 'string') {
    throw createHttpError(400, 'Mensagem livre inválida');
  }

  return value.trim();
}

function validateConfiguracaoEntregaPayload(payload) {
  if (!payload || typeof payload !== 'object') {
    throw createHttpError(400, 'Payload de configuração de entrega inválido');
  }

  const tempoMinimoMinutos = normalizeInteger(payload.tempoMinimoMinutos, 'Tempo mínimo');
  const tempoMaximoMinutos = normalizeInteger(payload.tempoMaximoMinutos, 'Tempo máximo');
  const mensagemLivre = normalizeMensagemLivre(payload.mensagemLivre);

  if (tempoMaximoMinutos < tempoMinimoMinutos) {
    throw createHttpError(400, 'Tempo máximo não pode ser menor que o tempo mínimo');
  }

  return {
    tempoMinimoMinutos,
    tempoMaximoMinutos,
    mensagemLivre,
  };
}

function createConfiguracaoEntregaService(dependencies = {}) {
  const { repository = inMemoryConfiguracaoEntregaRepository } = dependencies;

  return {
    getConfiguracaoEntrega() {
      return repository.get();
    },

    async updateConfiguracaoEntrega(payload, updatedByUsuarioId) {
      const validatedPayload = validateConfiguracaoEntregaPayload(payload);

      return repository.update({
        ...validatedPayload,
        updatedByUsuarioId,
        updatedAt: new Date().toISOString(),
      });
    },
  };
}

module.exports = {
  createConfiguracaoEntregaService,
  ...createConfiguracaoEntregaService(),
};
