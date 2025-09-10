const router = require('express').Router();
const { verifyToken, checkRole } = require('../middlewares/authentication.middlewares');
const orderController = require('../controllers/order.controller');
const { body, validationResult } = require('express-validator');

router.post('/createNew',
    [
        verifyToken,
        checkRole('owner'),
        body('total_amount').isFloat({ min: 0 }).withMessage('Total amount must be non-negative'),
        body('status').optional().isIn(['pending','paid','shipped','completed','cancelled']),
        (req, res, next) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            next();
        }
    ],
    orderController.createNew
);

router.get('/getAll', [verifyToken, checkRole('admin')], orderController.getAll);

router.get('/get/:id', [verifyToken], orderController.get);

router.put('/update/:id',
    [
        verifyToken,
        body('status').optional().isIn(['pending','paid','shipped','completed','cancelled']),
        (req, res, next) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            next();
        }
    ],
    orderController.update
);

router.delete('/remove/:id', [verifyToken, checkRole('admin')], orderController.remove);

router.get('/search', [verifyToken], orderController.search);

module.exports = router;
