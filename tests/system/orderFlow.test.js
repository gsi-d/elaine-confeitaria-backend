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
        endereco: data.endereco,
        tipoEntrega: data.tipoEntrega,
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

      pedido.endereco = data.endereco;
      pedido.tipoEntrega = data.tipoEntrega;
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
        endereco: 'Rua D, 45',
        tipoEntrega: 'ENTREGA',
        desconto: 10,
        itens: [
          { produtoId: 1, quantidade: 2 },
          { produtoId: 2, quantidade: 1 },
        ],
      }),
    });

    assert.equal(createResponse.status, 201);
    assert.equal(createResponse.json.valorTotal, 70);

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
        status: 'EM_PREPARO',
        desconto: 5,
        itens: [{ produtoId: 1, quantidade: 1 }],
      }),
    });

    assert.equal(updateResponse.status, 200);
    assert.equal(updateResponse.json.status, 'EM_PREPARO');
    assert.equal(updateResponse.json.valorTotal, 25);

    const getResponse = await requestJson(server.baseUrl, `/pedidos/${pedidoId}`, {
      headers: {
        authorization: `Bearer ${loginResponse.json.token}`,
      },
    });

    assert.equal(getResponse.status, 200);
    assert.equal(getResponse.json.id, pedidoId);

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
