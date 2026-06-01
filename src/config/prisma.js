process.env.PRISMA_CLIENT_ENGINE_TYPE = 'binary';

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({});

module.exports = prisma;
