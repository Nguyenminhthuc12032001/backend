const router = require('express').Router();
const { verifyToken, checkRole } = require('../middlewares/authentication.middlewares');
const orderController = require('../controllers/order.controller');

router.post('/createOrder', [verifyToken], orderController.createOrder);

router.get('/getAll', [verifyToken, checkRole('admin')], orderController.getAll);

router.get('/get/:id', [verifyToken, checkRole('admin')], orderController.get);

router.put('/addItems', [verifyToken], orderController.addItems);

router.put('/update/:id', [verifyToken, checkRole('admin')], orderController.update);

router.post('/remove/:id', [verifyToken, checkRole('admin')], orderController.remove);

router.get('/search', [verifyToken, checkRole('admin')], orderController.search);

router.get('/totalItems', [verifyToken], orderController.totalItems);

module.exports = router;
