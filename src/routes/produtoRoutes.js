const express = require('express');
const produtoController = require('../controllers/produtoController');

const router = express.Router();

router.get('/', produtoController.getAll);
router.get('/:id', produtoController.getById);

module.exports = router;
