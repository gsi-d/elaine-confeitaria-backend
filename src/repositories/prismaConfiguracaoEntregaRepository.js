const prismaClient = require('../config/prisma');

function createPrismaConfiguracaoEntregaRepository(prisma = prismaClient) {
  return {
    async get() {
      const configuracao = await prisma.configuracaoEntrega.findUnique({
        where: { id: 1 },
      });

      return configuracao || {
        id: 1,
        tempoMinimoMinutos: 0,
        tempoMaximoMinutos: 0,
        mensagemLivre: '',
        updatedByUsuarioId: null,
        updatedAt: null,
      };
    },

    update(data) {
      return prisma.configuracaoEntrega.upsert({
        where: { id: 1 },
        create: {
          id: 1,
          ...data,
        },
        update: data,
      });
    },
  };
}

module.exports = {
  createPrismaConfiguracaoEntregaRepository,
  prismaConfiguracaoEntregaRepository: createPrismaConfiguracaoEntregaRepository(),
};
