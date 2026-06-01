const usuarioService = require('../services/usuarioService');

async function getAll(request, response, next) {
  try {
    const usuarios = await usuarioService.getAllUsuarios();
    response.json(usuarios);
  } catch (error) {
    next(error);
  }
}

async function getById(request, response, next) {
  try {
    const id = Number(request.params.id);
    const usuario = await usuarioService.getUsuarioById(id);
    response.json(usuario);
  } catch (error) {
    next(error);
  }
}

async function create(request, response, next) {
  try {
    const usuario = await usuarioService.createUsuario(request.body);
    response.status(201).json(usuario);
  } catch (error) {
    next(error);
  }
}

async function update(request, response, next) {
  try {
    const id = Number(request.params.id);
    const usuario = await usuarioService.updateUsuario(id, request.body);
    response.json(usuario);
  } catch (error) {
    next(error);
  }
}

async function remove(request, response, next) {
  try {
    const id = Number(request.params.id);
    await usuarioService.deleteUsuario(id);
    response.status(204).send();
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove,
};

