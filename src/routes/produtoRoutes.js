const express = require('express');
const produtoController = require('../controllers/produtoController');

const router = express.Router();

router.get('/', produtoController.getAll);
router.get('/:id', produtoController.getById);
router.post('/', produtoController.create);
router.put('/:id', produtoController.update);
router.delete('/:id', produtoController.remove);

module.exports = router;

