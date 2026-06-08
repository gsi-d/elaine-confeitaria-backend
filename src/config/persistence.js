function getPersistenceDriver() {
  const rawValue = process.env.PERSISTENCE_DRIVER || 'memory';
  const normalizedValue = String(rawValue).trim().toLowerCase();

  return normalizedValue === 'prisma' ? 'prisma' : 'memory';
}

function isPrismaPersistenceEnabled() {
  return getPersistenceDriver() === 'prisma';
}

module.exports = {
  getPersistenceDriver,
  isPrismaPersistenceEnabled,
};
