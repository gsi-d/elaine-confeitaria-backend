const test = require('node:test');
const assert = require('node:assert/strict');
const jwt = require('jsonwebtoken');

const { jwtSecret } = require('../../src/config/env');
const { createApp } = require('../../src/app');
const { startTestServer, requestJson } = require('../helpers/http');

function createToken(userId = 1) {
  return jwt.sign({ id: userId, email: `user${userId}@elaine.com` }, jwtSecret);
}

test('GET /produtos retorna imagens do catalogo', async () => {
  const app = createApp();
  const server = await startTestServer(app);

  try {
    const response = await requestJson(server.baseUrl, '/produtos', {
      headers: {
        authorization: `Bearer ${createToken()}`,
      },
    });

    assert.equal(response.status, 200);
    assert.ok(Array.isArray(response.json));
    assert.equal(response.json[0].imagemUrl, '/assets/produtos/bolo-chocolate.png');
    assert.equal(response.json[0].imagemAlt, 'Bolo de chocolate com cobertura de brigadeiro');
  } finally {
    await server.close();
  }
});
