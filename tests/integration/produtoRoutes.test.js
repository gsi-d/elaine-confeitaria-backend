const test = require('node:test');
const assert = require('node:assert/strict');
const { createApp } = require('../../src/app');
const { startTestServer, requestJson } = require('../helpers/http');

test('GET /produtos retorna imagens do catalogo', async () => {
  const app = createApp();
  const server = await startTestServer(app);

  try {
    const response = await requestJson(server.baseUrl, '/produtos');

    assert.equal(response.status, 200);
    assert.ok(Array.isArray(response.json));
    assert.equal(response.json[0].precoUnitario, 95);
    assert.equal(typeof response.json[0].anexo, 'string');
    assert.ok(response.json[0].anexo.startsWith('iVBORw0KGgo'));
    assert.equal(response.json[0].imagemUrl, '/assets/produtos/bolo-chocolate.png');
    assert.equal(response.json[0].imagemAlt, 'Bolo de chocolate com cobertura de brigadeiro');
  } finally {
    await server.close();
  }
});
