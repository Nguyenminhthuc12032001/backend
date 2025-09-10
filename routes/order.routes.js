const router = require('express').Router();
const { verifyToken, checkRole } = require('../middlewares/authentication.middlewares');
const orderController = require('../controllers/order.controller');
const { body, validationResult } = require('express-validator');

// Create new order (owner)
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

// Get all orders (admin)
router.get('/getAll', [verifyToken, checkRole('admin')], orderController.getAll);

// Get order by ID
router.get('/get/:id', [verifyToken], orderController.get);

// Update order (admin có thể đổi status, owner có thể update info trước khi thanh toán)
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

// Remove order (admin)
router.delete('/remove/:id', [verifyToken, checkRole('admin')], orderController.remove);

// Search orders (owner: chỉ thấy của mình, admin: thấy tất cả)
router.get('/search', [verifyToken], orderController.search);

module.exports = router;
