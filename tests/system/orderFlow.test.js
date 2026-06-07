const test = require('node:test');
const assert = require('node:assert/strict');

const { createApp } = require('../../src/app');
const { createAuthService } = require('../../src/services/authService');
const { createPedidoService } = require('../../src/services/pedidoService');
const { hashPassword } = require('../../src/utils/password');
const { startTestServer, requestJson } = require('../helpers/http');

function createInMemoryPedidoRepository() {
  const pedidos = [];
  let nextPedidoId = 1;
  let nextItemId = 1;

  return {
    async findManyByUsuarioId(usuarioId) {
      return pedidos.filter((pedido) => pedido.usuarioId === usuarioId);
    },

    async findByIdAndUsuarioId(id, usuarioId) {
      return pedidos.find((pedido) => pedido.id === id && pedido.usuarioId === usuarioId) || null;
    },

    async create(data) {
      const pedido = {
        id: nextPedidoId++,
        usuarioId: data.usuarioId,
        nomeRecebedor: data.nomeRecebedor,
        endereco: data.endereco,
        complemento: data.complemento,
        referencia: data.referencia,
        tipoEntrega: data.tipoEntrega,
        melhorHorarioEntrega: data.melhorHorarioEntrega,
        observacoes: data.observacoes,
        anexo: data.anexo || [],
        valorTotal: data.valorTotal,
        desconto: data.desconto,
        status: data.status,
        usuario: {
          id: data.usuarioId,
          email: 'cliente@elaine.com',
        },
        itens: data.itens.create.map((item) => ({
          id: nextItemId++,
          ...item,
          produto: {
            id: item.produtoId,
            nome: `Produto ${item.produtoId}`,
          },
        })),
      };

      pedidos.push(pedido);
      return pedido;
    },

    async update(id, usuarioId, data) {
      const pedido = pedidos.find((item) => item.id === id && item.usuarioId === usuarioId);

      if (!pedido) {
        return null;
      }

      pedido.nomeRecebedor = data.nomeRecebedor;
      pedido.endereco = data.endereco;
      pedido.complemento = data.complemento;
      pedido.referencia = data.referencia;
      pedido.tipoEntrega = data.tipoEntrega;
      pedido.melhorHorarioEntrega = data.melhorHorarioEntrega;
      pedido.observacoes = data.observacoes;
      pedido.anexo = data.anexo;
      pedido.valorTotal = data.valorTotal;
      pedido.desconto = data.desconto;
      pedido.status = data.status;

      if (data.itens?.create) {
        pedido.itens = data.itens.create.map((item) => ({
          id: nextItemId++,
          ...item,
          produto: {
            id: item.produtoId,
            nome: `Produto ${item.produtoId}`,
          },
        }));
      }

      return pedido;
    },

    async delete(id, usuarioId) {
      const index = pedidos.findIndex((pedido) => pedido.id === id && pedido.usuarioId === usuarioId);

      if (index === -1) {
        return false;
      }

      pedidos.splice(index, 1);
      return true;
    },
  };
}

test('fluxo de login e CRUD de pedido funciona ponta a ponta', async () => {
  const senhaHash = await hashPassword('123456');

  const users = [
    {
      id: 1,
      email: 'cliente@elaine.com',
      senha: senhaHash,
      endereco: null,
      telefone: null,
      cpf: null,
      cnpj: null,
      dataNascimento: null,
    },
  ];

  const authService = createAuthService({
    repository: {
      async findByEmail(email) {
        return users.find((user) => user.email === email) || null;
      },
    },
  });

  const pedidoService = createPedidoService({
    repository: createInMemoryPedidoRepository(),
    priceLookupRepository: {
      async findActivePriceByProductId(produtoId) {
        return {
          preco: produtoId === 1 ? 30 : 20,
          produto: {
            id: produtoId,
            nome: `Produto ${produtoId}`,
          },
        };
      },
    },
  });

  const app = createApp({
    authService,
    pedidoService,
  });

  const server = await startTestServer(app);

  try {
    const loginResponse = await requestJson(server.baseUrl, '/auth/login', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        email: 'cliente@elaine.com',
        senha: '123456',
      }),
    });

    assert.equal(loginResponse.status, 200);
    assert.ok(loginResponse.json.token);

    const authHeader = {
      authorization: `Bearer ${loginResponse.json.token}`,
      'content-type': 'application/json',
    };

    const createResponse = await requestJson(server.baseUrl, '/pedidos', {
      method: 'POST',
      headers: authHeader,
      body: JSON.stringify({
        nomeRecebedor: 'Carlos',
        endereco: 'Rua D, 45',
        complemento: 'Bloco B',
        referencia: 'Praca central',
        tipoEntrega: 'ENTREGA',
        melhorHorarioEntrega: '18:00',
        observacoes: 'Ligar ao chegar',
        anexo: ['base64-a', 'base64-b'],
        desconto: 10,
        itens: [
          { produtoId: 1, quantidade: 2 },
          { produtoId: 2, quantidade: 1 },
        ],
      }),
    });

    assert.equal(createResponse.status, 201);
    assert.equal(createResponse.json.valorTotal, 70);
    assert.equal(createResponse.json.status, 'EM_ABERTO');
    assert.equal(createResponse.json.nomeRecebedor, 'Carlos');
    assert.deepEqual(createResponse.json.anexo, ['base64-a', 'base64-b']);

    const pedidoId = createResponse.json.id;

    const listResponse = await requestJson(server.baseUrl, '/pedidos', {
      headers: {
        authorization: `Bearer ${loginResponse.json.token}`,
      },
    });

    assert.equal(listResponse.status, 200);
    assert.equal(listResponse.json.length, 1);

    const updateResponse = await requestJson(server.baseUrl, `/pedidos/${pedidoId}`, {
      method: 'PUT',
      headers: authHeader,
      body: JSON.stringify({
        status: 'PRONTO_PARA_RETIRADA',
        anexo: ['base64-c'],
        desconto: 5,
        itens: [{ produtoId: 1, quantidade: 1 }],
      }),
    });

    assert.equal(updateResponse.status, 200);
    assert.equal(updateResponse.json.status, 'PRONTO_PARA_RETIRADA');
    assert.equal(updateResponse.json.valorTotal, 25);
    assert.deepEqual(updateResponse.json.anexo, ['base64-c']);

    const getResponse = await requestJson(server.baseUrl, `/pedidos/${pedidoId}`, {
      headers: {
        authorization: `Bearer ${loginResponse.json.token}`,
      },
    });

    assert.equal(getResponse.status, 200);
    assert.equal(getResponse.json.id, pedidoId);
    assert.deepEqual(getResponse.json.anexo, ['base64-c']);

    const deleteResponse = await requestJson(server.baseUrl, `/pedidos/${pedidoId}`, {
      method: 'DELETE',
      headers: {
        authorization: `Bearer ${loginResponse.json.token}`,
      },
    });

    assert.equal(deleteResponse.status, 204);

    const emptyListResponse = await requestJson(server.baseUrl, '/pedidos', {
      headers: {
        authorization: `Bearer ${loginResponse.json.token}`,
      },
    });

    assert.equal(emptyListResponse.status, 200);
    assert.equal(emptyListResponse.json.length, 0);
  } finally {
    await server.close();
  }
});
