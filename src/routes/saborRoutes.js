const express = require('express');
const saborController = require('../controllers/saborController');

const router = express.Router();

router.get('/', saborController.getAll);
router.get('/:id', saborController.getById);

module.exports = router;
