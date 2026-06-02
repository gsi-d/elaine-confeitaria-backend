const test = require('node:test');
const assert = require('node:assert/strict');

const {
  validateCreatePedidoPayload,
  validateUpdatePedidoPayload,
} = require('../../src/validators/pedidoValidator');

test('validateCreatePedidoPayload aceita pedido válido', () => {
  const payload = validateCreatePedidoPayload({
    endereco: 'Rua A, 10',
    tipoEntrega: 'entrega',
    desconto: 5,
    itens: [{ produtoId: 1, quantidade: 2 }],
  });

  assert.deepEqual(payload, {
    endereco: 'Rua A, 10',
    tipoEntrega: 'ENTREGA',
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
        itens: [{ produtoId: 1, quantidade: 2 }],
      }),
    /Endereço é obrigatório para entrega/,
  );
});

test('validateUpdatePedidoPayload exige ao menos um campo', () => {
  assert.throws(() => validateUpdatePedidoPayload({}), /Nenhum campo válido/);
});
