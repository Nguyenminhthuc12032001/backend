const router = require('express').Router();
const { verifyToken, checkRole } = require('../middlewares/authentication.middlewares');
const adminController = require('../controllers/admin.controller');
const { validationUser } = require('../middlewares/validdation.middlewares');
const { body, validationResult } = require('express-validator');

router.post('/createNew', [verifyToken, checkRole('admin'), validationUser], adminController.createNew);
router.get('/getAll', [verifyToken, checkRole('admin')], adminController.getAll);
router.get('/get/:id', [verifyToken, checkRole('admin')], adminController.get);
router.put('/update/:id', [verifyToken, checkRole('admin'), 
    body('password').isString().isLength({ min: 6, max: 20 }).optional().withMessage('Password must be between 6 and 20 characters'),
    body('role').optional().isIn(['admin', 'superadmin', 'moderator' ]).withMessage('Role must be one of admin, superadmin, or moderator'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()});
        }
    }
], adminController.update);
router.post('/remove/:id', [verifyToken, checkRole('superAdmin')], adminController.remove);
router.get('/search', [verifyToken, checkRole('superAdmin')], adminController.search);
router.post('/login', [validationAdmin], adminController.login);

module.exports = router;