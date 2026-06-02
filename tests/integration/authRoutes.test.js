const test = require('node:test');
const assert = require('node:assert/strict');

const { createApp } = require('../../src/app');
const { startTestServer, requestJson } = require('../helpers/http');

test('POST /auth/login retorna token com serviço injetado', async () => {
  const app = createApp({
    authService: {
      async login(email, senha) {
        return {
          token: `token-${email}-${senha}`,
          usuario: { id: 1, email },
        };
      },
    },
  });

  const server = await startTestServer(app);

  try {
    const response = await requestJson(server.baseUrl, '/auth/login', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        email: 'cliente@elaine.com',
        senha: '123456',
      }),
    });

    assert.equal(response.status, 200);
    assert.equal(response.json.usuario.email, 'cliente@elaine.com');
    assert.match(response.json.token, /^token-/);
  } finally {
    await server.close();
  }
});

test('POST /auth/login valida payload obrigatório', async () => {
  const app = createApp({
    authService: {
      async login() {
        throw new Error('não deveria chegar aqui');
      },
    },
  });

  const server = await startTestServer(app);

  try {
    const response = await requestJson(server.baseUrl, '/auth/login', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        email: 'cliente@elaine.com',
      }),
    });

    assert.equal(response.status, 400);
    assert.equal(response.json.message, 'Email e senha são obrigatórios');
  } finally {
    await server.close();
  }
});
