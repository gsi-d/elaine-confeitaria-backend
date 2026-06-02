const express = require('express');
const tpItemController = require('../controllers/tpItemController');

const router = express.Router();

router.get('/', tpItemController.getAll);
router.get('/:id', tpItemController.getById);

module.exports = router;
