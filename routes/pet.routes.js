const router = require('express').Router();
const { verifyToken, checkRole } = require('../middlewares/authentication.middlewares');
const petController = require('../controllers/pet.controller');
const { body, validationResult } = require('express-validator');

router.post('/createNew',
    [
        /*verifyToken,
        checkRole('owner'),*/
        body('name').isString().notEmpty().withMessage('Name is required'),
        body('species').isString().notEmpty().withMessage('Species is required'),
        body('age').optional().isInt({ min: 0 }).withMessage('Age must be >= 0'),
        body('gender').optional().isIn(['male','female','unknown']).withMessage('Invalid gender'),
        (req, res, next) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            next();
        }
    ],
    petController.createNew
);

router.get('/getAll', [verifyToken, checkRole('admin')], petController.getAll);

router.get('/get/:id', [verifyToken], petController.get);

router.put('/update/:id',
    [
        verifyToken,
        checkRole('owner'),
        body('age').optional().isInt({ min: 0 }),
        body('gender').optional().isIn(['male','female','unknown']),
        (req, res, next) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            next();
        }
    ],
    petController.update
);

router.delete('/remove/:id', [verifyToken], petController.remove);

router.get('/search', [verifyToken], petController.search);

module.exports = router;
