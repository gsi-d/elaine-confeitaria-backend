const express = require('express');
const tabelaPrecoController = require('../controllers/tabelaPrecoController');

const router = express.Router();

router.get('/', tabelaPrecoController.getAll);
router.get('/:id', tabelaPrecoController.getById);

module.exports = router;
