const test = require('node:test');
const assert = require('node:assert/strict');
const jwt = require('jsonwebtoken');

const { jwtSecret } = require('../../src/config/env');
const { createApp } = require('../../src/app');
const { startTestServer, requestJson } = require('../helpers/http');

function createToken(userId = 1) {
  return jwt.sign({ id: userId, email: `user${userId}@elaine.com` }, jwtSecret);
}

test('GET /pedidos exige autenticação', async () => {
  const app = createApp({
    pedidoService: {
      async getAllPedidos() {
        return [];
      },
    },
  });

  const server = await startTestServer(app);

  try {
    const response = await requestJson(server.baseUrl, '/pedidos');

    assert.equal(response.status, 401);
    assert.equal(response.json.message, 'Token não informado');
  } finally {
    await server.close();
  }
});

test('POST /pedidos usa usuário autenticado e retorna criação', async () => {
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
          status: 'PENDENTE',
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
        endereco: 'Rua C, 100',
        tipoEntrega: 'ENTREGA',
        itens: [{ produtoId: 1, quantidade: 1 }],
      }),
    });

    assert.equal(response.status, 201);
    assert.equal(receivedUserId, 25);
    assert.equal(receivedPayload.tipoEntrega, 'ENTREGA');
    assert.equal(response.json.id, 55);
  } finally {
    await server.close();
  }
});
