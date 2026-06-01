const express = require('express');
const saborController = require('../controllers/saborController');

const router = express.Router();

router.get('/', saborController.getAll);
router.get('/:id', saborController.getById);
router.post('/', saborController.create);
router.put('/:id', saborController.update);
router.delete('/:id', saborController.remove);

module.exports = router;

