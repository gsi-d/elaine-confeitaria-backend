const express = require('express');
const tabelaPrecoController = require('../controllers/tabelaPrecoController');

const router = express.Router();

router.get('/', tabelaPrecoController.getAll);
router.get('/:id', tabelaPrecoController.getById);
router.post('/', tabelaPrecoController.create);
router.put('/:id', tabelaPrecoController.update);
router.delete('/:id', tabelaPrecoController.remove);

module.exports = router;

