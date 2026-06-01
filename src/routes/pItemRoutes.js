const express = require('express');
const pItemController = require('../controllers/pItemController');

const router = express.Router();

router.get('/', pItemController.getAll);
router.get('/:id', pItemController.getById);
router.post('/', pItemController.create);
router.put('/:id', pItemController.update);
router.delete('/:id', pItemController.remove);

module.exports = router;

