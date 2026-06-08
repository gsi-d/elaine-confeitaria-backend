const test = require('node:test');
const assert = require('node:assert/strict');

const MODULE_PATH = '../../src/config/persistence';

test('getPersistenceDriver usa memory por padrão', () => {
  const previousValue = process.env.PERSISTENCE_DRIVER;
  delete process.env.PERSISTENCE_DRIVER;
  delete require.cache[require.resolve(MODULE_PATH)];

  const { getPersistenceDriver } = require(MODULE_PATH);

  assert.equal(getPersistenceDriver(), 'memory');

  delete require.cache[require.resolve(MODULE_PATH)];
  if (previousValue === undefined) {
    delete process.env.PERSISTENCE_DRIVER;
  } else {
    process.env.PERSISTENCE_DRIVER = previousValue;
  }
});

test('getPersistenceDriver normaliza prisma em qualquer capitalização', () => {
  const previousValue = process.env.PERSISTENCE_DRIVER;
  process.env.PERSISTENCE_DRIVER = 'PrIsMa';
  delete require.cache[require.resolve(MODULE_PATH)];

  const { getPersistenceDriver, isPrismaPersistenceEnabled } = require(MODULE_PATH);

  assert.equal(getPersistenceDriver(), 'prisma');
  assert.equal(isPrismaPersistenceEnabled(), true);

  delete require.cache[require.resolve(MODULE_PATH)];
  if (previousValue === undefined) {
    delete process.env.PERSISTENCE_DRIVER;
  } else {
    process.env.PERSISTENCE_DRIVER = previousValue;
  }
});
