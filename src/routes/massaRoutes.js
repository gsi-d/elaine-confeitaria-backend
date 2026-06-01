const express = require('express');
const massaController = require('../controllers/massaController');

const router = express.Router();

router.get('/', massaController.getAll);
router.get('/:id', massaController.getById);
router.post('/', massaController.create);
router.put('/:id', massaController.update);
router.delete('/:id', massaController.remove);

module.exports = router;

