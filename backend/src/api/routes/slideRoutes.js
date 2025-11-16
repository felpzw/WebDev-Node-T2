const express = require('express');
const router = express.Router();
const slideController = require('../controllers/slideController');
const authAdmin = require('../middleware/authAdmin');


router.use(authAdmin);


router.get('/', slideController.list);

router.post('/', slideController.create);

router.put('/:id', slideController.update);

router.delete('/:id', slideController.remove);


module.exports = router;