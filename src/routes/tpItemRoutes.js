const express = require('express');
const tpItemController = require('../controllers/tpItemController');

const router = express.Router();

router.get('/', tpItemController.getAll);
router.get('/:id', tpItemController.getById);
router.post('/', tpItemController.create);
router.put('/:id', tpItemController.update);
router.delete('/:id', tpItemController.remove);

module.exports = router;

