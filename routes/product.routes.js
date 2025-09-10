const router = require('express').Router();
const { verifyToken, checkRole } = require('../middlewares/authentication.middlewares');
const productController = require('../controllers/product.controller');
const { body, validationResult } = require('express-validator');

router.post('/createNew',
    [
        verifyToken,
        checkRole('admin'),
        body('name').isString().notEmpty().withMessage('Name is required'),
        body('category').isString().notEmpty().withMessage('Category is required'),
        body('price').isFloat({ min: 0 }).withMessage('Price must be >= 0'),
        body('stock_quantity').isInt({ min: 0 }).withMessage('Stock must be >= 0'),
        (req, res, next) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            next();
        }
    ],
    productController.createNew
);

router.get('/getAll', productController.getAll);

router.get('/get/:id', productController.get);

router.put('/update/:id',
    [
        verifyToken,
        checkRole('admin'),
        body('price').optional().isFloat({ min: 0 }),
        body('stock_quantity').optional().isInt({ min: 0 }),
        (req, res, next) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            next();
        }
    ],
    productController.update
);

router.delete('/remove/:id', [verifyToken, checkRole('admin')], productController.remove);

router.get('/search', productController.search);

module.exports = router;
