const router = require('express').Router();
const { verifyToken, checkRole } = require('../middlewares/authentication.middlewares');
const orderItemController = require('../controllers/orderItem.controller');
const { body, validationResult } = require('express-validator');

// Create new order item
router.post('/createNew',
    [
        verifyToken,
        checkRole('admin'),
        body('quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
        body('price_each').isFloat({ min: 0 }).withMessage('Price must be non-negative'),
        (req, res, next) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            next();
        }
    ],
    orderItemController.createNew
);

// Get all order items (admin)
router.get('/getAll', [verifyToken, checkRole('admin')], orderItemController.getAll);

// Get one by ID
router.get('/get/:id', [verifyToken], orderItemController.get);

// Update order item
router.put('/update/:id',
    [
        verifyToken,
        checkRole('admin'),
        body('quantity').optional().isInt({ min: 1 }),
        body('price_each').optional().isFloat({ min: 0 }),
        (req, res, next) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            next();
        }
    ],
    orderItemController.update
);

// Remove order item
router.delete('/remove/:id', [verifyToken, checkRole('admin')], orderItemController.remove);

// Search order items
router.get('/search', [verifyToken], orderItemController.search);

module.exports = router;
