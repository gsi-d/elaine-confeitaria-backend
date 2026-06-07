const test = require('node:test');
const assert = require('node:assert/strict');
const jwt = require('jsonwebtoken');

const { jwtSecret } = require('../../src/config/env');
const { createApp } = require('../../src/app');
const { startTestServer, requestJson } = require('../helpers/http');

function createToken(userId = 1) {
  return jwt.sign({ id: userId, email: `user${userId}@elaine.com` }, jwtSecret);
}

test('GET /configuracao-entrega retorna configuracao sem autenticação', async () => {
  const app = createApp({
    configuracaoEntregaService: {
      async getConfiguracaoEntrega() {
        return {
          tempoMinimoMinutos: 60,
          tempoMaximoMinutos: 90,
          mensagemLivre: 'Prazo atual',
          updatedByUsuarioId: 1,
          updatedAt: '2026-01-01T12:00:00.000Z',
        };
      },
    },
  });
  const server = await startTestServer(app);

  try {
    const response = await requestJson(server.baseUrl, '/configuracao-entrega');

    assert.equal(response.status, 200);
    assert.equal(response.json.tempoMinimoMinutos, 60);
    assert.equal(response.json.tempoMaximoMinutos, 90);
  } finally {
    await server.close();
  }
});

test('PUT /configuracao-entrega permite atualização para admin', async () => {
  const app = createApp({
    configuracaoEntregaService: {
      async updateConfiguracaoEntrega(payload, updatedByUsuarioId) {
        return {
          ...payload,
          updatedByUsuarioId,
          updatedAt: '2026-06-07T13:00:00.000Z',
        };
      },
    },
  });
  const server = await startTestServer(app);

  try {
    const response = await requestJson(server.baseUrl, '/configuracao-entrega', {
      method: 'PUT',
      headers: {
        authorization: `Bearer ${createToken(1)}`,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        tempoMinimoMinutos: 90,
        tempoMaximoMinutos: 120,
        mensagemLivre: 'Alta demanda no momento',
      }),
    });

    assert.equal(response.status, 200);
    assert.equal(response.json.tempoMinimoMinutos, 90);
    assert.equal(response.json.tempoMaximoMinutos, 120);
    assert.equal(response.json.updatedByUsuarioId, 1);
  } finally {
    await server.close();
  }
});

test('PUT /configuracao-entrega bloqueia usuário não admin', async () => {
  const app = createApp();
  const server = await startTestServer(app);

  try {
    const response = await requestJson(server.baseUrl, '/configuracao-entrega', {
      method: 'PUT',
      headers: {
        authorization: `Bearer ${createToken(2)}`,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        tempoMinimoMinutos: 30,
        tempoMaximoMinutos: 45,
        mensagemLivre: 'Teste',
      }),
    });

    assert.equal(response.status, 403);
    assert.equal(response.json.message, 'Acesso restrito a administradores');
  } finally {
    await server.close();
  }
});
