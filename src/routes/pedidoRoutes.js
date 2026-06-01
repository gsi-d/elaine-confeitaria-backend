const express = require('express');
const pedidoController = require('../controllers/pedidoController');

const router = express.Router();

router.get('/', pedidoController.getAll);
router.get('/:id', pedidoController.getById);
router.post('/', pedidoController.create);
router.put('/:id', pedidoController.update);
router.delete('/:id', pedidoController.remove);

module.exports = router;

