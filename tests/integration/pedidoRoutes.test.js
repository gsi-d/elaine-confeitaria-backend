const test = require('node:test');
const assert = require('node:assert/strict');
const jwt = require('jsonwebtoken');

const { jwtSecret } = require('../../src/config/env');
const { createApp } = require('../../src/app');
const { startTestServer, requestJson } = require('../helpers/http');

function createToken(userId = 1) {
  return jwt.sign({ id: userId, email: `user${userId}@elaine.com` }, jwtSecret);
}

test('GET /pedidos funciona sem autenticação', async () => {
  const app = createApp({
    pedidoService: {
      async getAllPedidos(userId) {
        assert.equal(userId, 1);
        return [];
      },
    },
  });

  const server = await startTestServer(app);

  try {
    const response = await requestJson(server.baseUrl, '/pedidos');

    assert.equal(response.status, 200);
    assert.deepEqual(response.json, []);
  } finally {
    await server.close();
  }
});

test('POST /pedidos usa usuário autenticado quando token é enviado e retorna criação', async () => {
  let receivedUserId;
  let receivedPayload;

  const app = createApp({
    pedidoService: {
      async createPedido(userId, payload) {
        receivedUserId = userId;
        receivedPayload = payload;
        return {
          id: 55,
          usuarioId: userId,
          ...payload,
          valorTotal: 42,
          status: 'EM_ABERTO',
          itens: [],
        };
      },
    },
  });

  const server = await startTestServer(app);

  try {
    const response = await requestJson(server.baseUrl, '/pedidos', {
      method: 'POST',
      headers: {
        authorization: `Bearer ${createToken(25)}`,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        nomeRecebedor: 'Marcia',
        endereco: 'Rua C, 100',
        complemento: 'Fundos',
        referencia: 'Mercado da esquina',
        tipoEntrega: 'ENTREGA',
        melhorHorarioEntrega: '13:30',
        observacoes: 'Chamar no portao',
        itens: [{ produtoId: 1, quantidade: 1 }],
      }),
    });

    assert.equal(response.status, 201);
    assert.equal(receivedUserId, 25);
    assert.equal(receivedPayload.tipoEntrega, 'ENTREGA');
    assert.equal(receivedPayload.nomeRecebedor, 'Marcia');
    assert.equal(response.json.id, 55);
  } finally {
    await server.close();
  }
});

test('PATCH /pedidos/:id/status altera status com status no payload', async () => {
  let receivedId;
  let receivedPayload;

  const app = createApp({
    pedidoService: {
      async updatePedidoStatus(id, payload) {
        receivedId = id;
        receivedPayload = payload;

        return {
          id,
          usuarioId: payload.usuarioId,
          status: payload.status,
        };
      },
    },
  });

  const server = await startTestServer(app);

  try {
    const response = await requestJson(server.baseUrl, '/pedidos/12/status', {
      method: 'PATCH',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        status: 'SAIU_PARA_ENTREGA',
      }),
    });

    assert.equal(response.status, 200);
    assert.equal(receivedId, 12);
    assert.deepEqual(receivedPayload, {
      status: 'SAIU_PARA_ENTREGA',
    });
    assert.equal(response.json.status, 'SAIU_PARA_ENTREGA');
  } finally {
    await server.close();
  }
});
