const prisma = require('../config/prisma');
const { encrypt, decrypt } = require('../utils/encryption');
const { hashPassword } = require('../utils/password');

function encryptUsuarioFields(usuarioData) {
  const encrypted = { ...usuarioData };

  if (encrypted.endereco !== undefined) {
    encrypted.endereco = encrypt(encrypted.endereco);
  }
  if (encrypted.telefone !== undefined) {
    encrypted.telefone = encrypt(encrypted.telefone);
  }
  if (encrypted.cpf !== undefined) {
    encrypted.cpf = encrypt(encrypted.cpf);
  }
  if (encrypted.cnpj !== undefined) {
    encrypted.cnpj = encrypt(encrypted.cnpj);
  }
  if (encrypted.dataNascimento !== undefined) {
    encrypted.dataNascimento = encrypt(encrypted.dataNascimento);
  }

  return encrypted;
}

function decryptUsuarioFields(usuario) {
  if (!usuario) {
    return null;
  }

  return {
    ...usuario,
    endereco: usuario.endereco ? decrypt(usuario.endereco) : null,
    telefone: usuario.telefone ? decrypt(usuario.telefone) : null,
    cpf: usuario.cpf ? decrypt(usuario.cpf) : null,
    cnpj: usuario.cnpj ? decrypt(usuario.cnpj) : null,
    dataNascimento: usuario.dataNascimento ? decrypt(usuario.dataNascimento) : null,
  };
}

function sanitizeUsuario(usuario) {
  const decrypted = decryptUsuarioFields(usuario);

  if (!decrypted) {
    return null;
  }

  const safeUsuario = { ...decrypted };
  delete safeUsuario.senha;

  return safeUsuario;
}

async function getAllUsuarios() {
  const usuarios = await prisma.usuario.findMany();
  return usuarios.map(sanitizeUsuario);
}

async function getUsuarioById(id) {
  const usuario = await prisma.usuario.findUnique({ where: { id } });

  if (!usuario) {
    const error = new Error('Usuário não encontrado');
    error.statusCode = 404;
    throw error;
  }

  return sanitizeUsuario(usuario);
}

async function createUsuario(data) {
  if (!data.email || !data.senha) {
    const error = new Error('Email e senha são obrigatórios');
    error.statusCode = 400;
    throw error;
  }

  const hashedPassword = await hashPassword(data.senha);
  const encryptedFields = encryptUsuarioFields(data);

  const created = await prisma.usuario.create({
    data: {
      email: data.email,
      senha: hashedPassword,
      endereco: encryptedFields.endereco,
      telefone: encryptedFields.telefone,
      cpf: encryptedFields.cpf,
      cnpj: encryptedFields.cnpj,
      dataNascimento: encryptedFields.dataNascimento,
    },
  });

  return sanitizeUsuario(created);
}

async function updateUsuario(id, data) {
  const updateData = {};

  if (data.email !== undefined) {
    updateData.email = data.email;
  }

  if (data.senha) {
    updateData.senha = await hashPassword(data.senha);
  }

  const encryptedFields = encryptUsuarioFields(data);

  if (data.endereco !== undefined) {
    updateData.endereco = encryptedFields.endereco;
  }
  if (data.telefone !== undefined) {
    updateData.telefone = encryptedFields.telefone;
  }
  if (data.cpf !== undefined) {
    updateData.cpf = encryptedFields.cpf;
  }
  if (data.cnpj !== undefined) {
    updateData.cnpj = encryptedFields.cnpj;
  }
  if (data.dataNascimento !== undefined) {
    updateData.dataNascimento = encryptedFields.dataNascimento;
  }

  try {
    const updated = await prisma.usuario.update({
      where: { id },
      data: updateData,
    });

    return sanitizeUsuario(updated);
  } catch (error) {
    if (error.code === 'P2025') {
      const notFoundError = new Error('Usuário não encontrado');
      notFoundError.statusCode = 404;
      throw notFoundError;
    }

    throw error;
  }
}

async function deleteUsuario(id) {
  try {
    await prisma.usuario.delete({ where: { id } });
  } catch (error) {
    if (error.code === 'P2025') {
      const notFoundError = new Error('Usuário não encontrado');
      notFoundError.statusCode = 404;
      throw notFoundError;
    }

    throw error;
  }
}

module.exports = {
  getAllUsuarios,
  getUsuarioById,
  createUsuario,
  updateUsuario,
  deleteUsuario,
  sanitizeUsuario,
};

