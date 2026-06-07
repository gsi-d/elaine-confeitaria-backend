const test = require('node:test');
const assert = require('node:assert/strict');

const {
  validateCreatePedidoPayload,
  validateUpdatePedidoPayload,
} = require('../../src/validators/pedidoValidator');

test('validateCreatePedidoPayload aceita pedido válido', () => {
  const payload = validateCreatePedidoPayload({
    nomeRecebedor: 'Maria',
    endereco: 'Rua A, 10',
    complemento: 'Apto 12',
    referencia: 'Ao lado da farmacia',
    tipoEntrega: 'entrega',
    melhorHorarioEntrega: '15:30',
    observacoes: 'Tocar interfone',
    desconto: 5,
    itens: [{ produtoId: 1, quantidade: 2 }],
  });

  assert.deepEqual(payload, {
    nomeRecebedor: 'Maria',
    endereco: 'Rua A, 10',
    complemento: 'Apto 12',
    referencia: 'Ao lado da farmacia',
    tipoEntrega: 'ENTREGA',
    melhorHorarioEntrega: '15:30',
    observacoes: 'Tocar interfone',
    anexo: [],
    desconto: 5,
    itens: [{ produtoId: 1, quantidade: 2 }],
  });
});

test('validateCreatePedidoPayload exige endereço para entrega', () => {
  assert.throws(
    () =>
      validateCreatePedidoPayload({
        endereco: '   ',
        tipoEntrega: 'ENTREGA',
        nomeRecebedor: 'Maria',
        melhorHorarioEntrega: '15:30',
        itens: [{ produtoId: 1, quantidade: 2 }],
      }),
    /Endereço é obrigatório para entrega/,
  );
});

test('validateCreatePedidoPayload exige nome e melhor horario para entrega', () => {
  assert.throws(
    () =>
      validateCreatePedidoPayload({
        endereco: 'Rua A, 10',
        tipoEntrega: 'ENTREGA',
        melhorHorarioEntrega: '',
        itens: [{ produtoId: 1, quantidade: 2 }],
      }),
    /Nome de quem vai receber é obrigatório para entrega/,
  );
});

test('validateUpdatePedidoPayload exige ao menos um campo', () => {
  assert.throws(() => validateUpdatePedidoPayload({}), /Nenhum campo válido/);
});

test('validateCreatePedidoPayload rejeita anexo fora de array', () => {
  assert.throws(
    () =>
      validateCreatePedidoPayload({
        endereco: 'Rua A, 10',
        tipoEntrega: 'ENTREGA',
        anexo: 'arquivo.png',
        itens: [{ produtoId: 1, quantidade: 1 }],
      }),
    /Anexo deve ser um array/,
  );
});
