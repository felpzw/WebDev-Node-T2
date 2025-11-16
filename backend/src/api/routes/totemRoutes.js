const express = require('express');
const router = express.Router();
const totemController = require('../controllers/totemController');
const authAdmin = require('../middleware/authAdmin');

router.use(authAdmin);

router.get('/', totemController.list);

router.post('/', totemController.create);

router.delete('/:id', totemController.remove);


module.exports = router;