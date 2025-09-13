const router = require('express').Router();
const { verifyToken, checkRole } = require('../middlewares/authentication.middlewares');
const productController = require('../controllers/product.controller');
const { validProduct, validProductUpdate } = require('../middlewares/product.middleware');

router.post('/createNew', [verifyToken, checkRole('admin'), validProduct], productController.createNew);

router.get('/getAll', productController.getAll);

router.get('/get/:id', productController.get);

router.put('/update/:id', [verifyToken, checkRole('admin'), validProductUpdate], productController.update);

router.post('/remove/:id', [verifyToken, checkRole('admin')], productController.remove);

router.get('/search', productController.search);

module.exports = router;
