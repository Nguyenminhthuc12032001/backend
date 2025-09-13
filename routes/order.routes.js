const router = require('express').Router();
const { verifyToken, checkRole } = require('../middlewares/authentication.middlewares');
const orderController = require('../controllers/order.controller');
const { validOrder, validOrderUpdate } = require('../middlewares/order.middleware');

router.post('/createOrder', [verifyToken, validOrder], orderController.createOrder);

router.get('/getAll', [verifyToken, checkRole('admin')], orderController.getAll);

router.get('/get/:id', [verifyToken, checkRole('admin')], orderController.get);

router.put('/addItems', [verifyToken, validOrderUpdate], orderController.addItems);

router.put('/update/:id', [verifyToken, checkRole('admin'), validOrderUpdate], orderController.update);

router.post('/remove/:id', [verifyToken, checkRole('admin')], orderController.remove);

router.get('/search', [verifyToken, checkRole('admin')], orderController.search);

router.get('/totalItems', [verifyToken], orderController.totalItems);

router.get('/getCurrentCart', [verifyToken], orderController.getCurrentCart);

module.exports = router;
