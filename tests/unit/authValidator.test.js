const test = require('node:test');
const assert = require('node:assert/strict');

const { validateLoginPayload } = require('../../src/validators/authValidator');

test('validateLoginPayload normaliza email e retorna senha', () => {
  const payload = validateLoginPayload({
    email: ' CLIENTE@ELAINE.COM ',
    senha: '123456',
  });

  assert.deepEqual(payload, {
    email: 'cliente@elaine.com',
    senha: '123456',
  });
});

test('validateLoginPayload rejeita payload sem senha', () => {
  assert.throws(
    () => validateLoginPayload({ email: 'cliente@elaine.com' }),
    /Email e senha são obrigatórios/,
  );
});
