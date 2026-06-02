const express = require('express');
const massaController = require('../controllers/massaController');

const router = express.Router();

router.get('/', massaController.getAll);
router.get('/:id', massaController.getById);

module.exports = router;
