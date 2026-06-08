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
    nomeRecebedor: 'Joana',
    endereco: 'Rua B, 22',
    complemento: 'Casa',
    referencia: 'Porta azul',
    tipoEntrega: 'ENTREGA',
    melhorHorarioEntrega: '16:00',
    observacoes: 'Sem cebola',
    anexo: ['arquivo-base64'],
    desconto: 5,
    itens: [{ produtoId: 3, quantidade: 2 }],
  });

  assert.equal(result.id, 10);
  assert.equal(persistedPayload.usuarioId, 99);
  assert.equal(persistedPayload.valorTotal, 25);
  assert.equal(persistedPayload.nomeRecebedor, 'Joana');
  assert.equal(persistedPayload.status, 'EM_ABERTO');
  assert.deepEqual(persistedPayload.anexo, ['arquivo-base64']);
  assert.equal(persistedPayload.itens.create[0].preco, 15);
});

test('pedidoService.getAllPedidos retorna todos os pedidos para admin', async () => {
  let listedAll = false;

  const service = createPedidoService({
    repository: {
      async findManyByUsuarioId() {
        throw new Error('não deveria filtrar por usuário');
      },
      async findMany() {
        listedAll = true;
        return [{ id: 1 }, { id: 2 }];
      },
    },
    userRepository: {
      async findById(id) {
        return { id, isAdmin: true };
      },
    },
  });

  const result = await service.getAllPedidos(7);

  assert.equal(listedAll, true);
  assert.deepEqual(result, [{ id: 1 }, { id: 2 }]);
});

test('pedidoService.getPedidoById busca qualquer pedido para admin', async () => {
  let lookedUpAll = false;

  const service = createPedidoService({
    repository: {
      async findByIdAndUsuarioId() {
        throw new Error('não deveria filtrar por usuário');
      },
      async findById(id) {
        lookedUpAll = true;
        return { id, usuarioId: 99 };
      },
    },
    userRepository: {
      async findById(id) {
        return { id, isAdmin: true };
      },
    },
  });

  const result = await service.getPedidoById(12, 7);

  assert.equal(lookedUpAll, true);
  assert.deepEqual(result, { id: 12, usuarioId: 99 });
});
