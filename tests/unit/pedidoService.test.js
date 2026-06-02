const test = require('node:test');
const assert = require('node:assert/strict');

const {
  createPedidoService,
  calculateTotals,
  hydrateItens,
} = require('../../src/services/pedidoService');

test('calculateTotals desconta valor final corretamente', () => {
  const result = calculateTotals(
    [
      { preco: 10, quantidade: 2 },
      { preco: 5.5, quantidade: 1 },
    ],
    3,
  );

  assert.deepEqual(result, {
    subtotal: 25.5,
    valorTotal: 22.5,
  });
});

test('hydrateItens usa tabela de preço ativa', async () => {
  const itens = await hydrateItens([{ produtoId: 1, quantidade: 2 }], {
    async findActivePriceByProductId() {
      return {
        preco: 22,
        produto: { id: 1, nome: 'Bolo' },
      };
    },
  });

  assert.deepEqual(itens, [
    {
      produtoId: 1,
      quantidade: 2,
      preco: 22,
      produto: { id: 1, nome: 'Bolo' },
    },
  ]);
});

test('pedidoService.createPedido calcula total e persiste itens', async () => {
  let persistedPayload;

  const service = createPedidoService({
    repository: {
      async create(data) {
        persistedPayload = data;
        return { id: 10, ...data };
      },
      async findByIdAndUsuarioId() {
        return null;
      },
    },
    priceLookupRepository: {
      async findActivePriceByProductId(produtoId) {
        return {
          preco: 15,
          produto: { id: produtoId, nome: 'Cupcake' },
        };
      },
    },
  });

  const result = await service.createPedido(99, {
    endereco: 'Rua B, 22',
    tipoEntrega: 'ENTREGA',
    desconto: 5,
    itens: [{ produtoId: 3, quantidade: 2 }],
  });

  assert.equal(result.id, 10);
  assert.equal(persistedPayload.usuarioId, 99);
  assert.equal(persistedPayload.valorTotal, 25);
  assert.equal(persistedPayload.itens.create[0].preco, 15);
});
