const test = require('node:test');
const assert = require('node:assert/strict');

const { createAuthService } = require('../../src/services/authService');

test('authService.login retorna token e usuário sanitizado', async () => {
  const service = createAuthService({
    repository: {
      async findByEmail() {
        return {
          id: 7,
          email: 'cliente@elaine.com',
          senha: 'hashed',
          isAdmin: true,
          endereco: null,
        };
      },
    },
    passwordComparer: async () => true,
    tokenSigner: () => 'signed-token',
    secret: 'secret',
    expiresIn: '1h',
  });

  const result = await service.login('cliente@elaine.com', '123456');

  assert.equal(result.token, 'signed-token');
  assert.equal(result.usuario.id, 7);
  assert.equal(result.usuario.email, 'cliente@elaine.com');
  assert.equal(result.usuario.isAdmin, true);
  assert.equal(result.usuario.senha, undefined);
});

test('authService.login rejeita senha inválida', async () => {
  const service = createAuthService({
    repository: {
      async findByEmail() {
        return {
          id: 7,
          email: 'cliente@elaine.com',
          senha: 'hashed',
          isAdmin: true,
        };
      },
    },
    passwordComparer: async () => false,
  });

  await assert.rejects(
    () => service.login('cliente@elaine.com', '123456'),
    /Usuário ou senha inválidos/,
  );
});
