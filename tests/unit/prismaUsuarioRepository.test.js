const test = require('node:test');
const assert = require('node:assert/strict');

const { createPrismaUsuarioRepository } = require('../../src/repositories/prismaUsuarioRepository');

test('prisma usuario repository delega operações básicas ao client', async () => {
  const calls = [];
  const prisma = {
    usuario: {
      findUnique(args) {
        calls.push(['findUnique', args]);
        return Promise.resolve({ id: 7, email: 'cliente@elaine.com' });
      },
      findMany(args) {
        calls.push(['findMany', args]);
        return Promise.resolve([{ id: 1 }, { id: 2 }]);
      },
      create(args) {
        calls.push(['create', args]);
        return Promise.resolve({ id: 3, ...args.data });
      },
      update(args) {
        calls.push(['update', args]);
        return Promise.resolve({ id: args.where.id, ...args.data });
      },
      delete(args) {
        calls.push(['delete', args]);
        return Promise.resolve({ id: args.where.id });
      },
    },
  };

  const repository = createPrismaUsuarioRepository(prisma);

  assert.deepEqual(await repository.findByEmail('cliente@elaine.com'), {
    id: 7,
    email: 'cliente@elaine.com',
  });
  assert.deepEqual(await repository.findMany(), [{ id: 1 }, { id: 2 }]);
  assert.deepEqual(await repository.create({ email: 'novo@cliente.com' }), {
    id: 3,
    email: 'novo@cliente.com',
  });
  assert.deepEqual(await repository.update(9, { email: 'editado@cliente.com' }), {
    id: 9,
    email: 'editado@cliente.com',
  });
  assert.deepEqual(await repository.delete(11), { id: 11 });

  assert.deepEqual(calls, [
    ['findUnique', { where: { email: 'cliente@elaine.com' } }],
    ['findMany', { orderBy: { id: 'asc' } }],
    ['create', { data: { email: 'novo@cliente.com' } }],
    ['update', { where: { id: 9 }, data: { email: 'editado@cliente.com' } }],
    ['delete', { where: { id: 11 } }],
  ]);
});
