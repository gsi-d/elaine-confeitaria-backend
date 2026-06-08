const prismaClient = require('../config/prisma');

function createPrismaUsuarioRepository(prisma = prismaClient) {
  return {
    findByEmail(email) {
      return prisma.usuario.findUnique({
        where: { email },
      });
    },

    findMany() {
      return prisma.usuario.findMany({
        orderBy: { id: 'asc' },
      });
    },

    findById(id) {
      return prisma.usuario.findUnique({
        where: { id },
      });
    },

    create(data) {
      return prisma.usuario.create({
        data,
      });
    },

    update(id, data) {
      return prisma.usuario.update({
        where: { id },
        data,
      });
    },

    delete(id) {
      return prisma.usuario.delete({
        where: { id },
      });
    },
  };
}

module.exports = {
  createPrismaUsuarioRepository,
  prismaUsuarioRepository: createPrismaUsuarioRepository(),
};
