const router = require('express').Router();
const { verifyToken, checkRole } = require('../middlewares/authentication.middlewares');
const healthRecordController = require('../controllers/healthRecord.controller');
const { body, validationResult } = require('express-validator');

router.post('/createNew', 
    [
        verifyToken,
        checkRole('vet'),
        body('visit_date').isISO8601().withMessage('Visit date must be a valid date'),
        body('diagnosis').isString().notEmpty().withMessage('Diagnosis is required'),
        (req, res, next) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            next();
        }
    ], 
    healthRecordController.createNew
);

router.get('/getAll', [verifyToken, checkRole('admin')], healthRecordController.getAll);

router.get('/get/:id', [verifyToken], healthRecordController.get);

router.put('/update/:id', 
    [
        verifyToken,
        checkRole('vet'),
        body('diagnosis').optional().isString(),
        body('treatment').optional().isString(),
        body('visit_date').optional().isISO8601().withMessage('Visit date must be valid'),
        (req, res, next) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            next();
        }
    ], 
    healthRecordController.update
);

router.delete('/remove/:id', [verifyToken, checkRole('admin')], healthRecordController.remove);

router.get('/search', [verifyToken], healthRecordController.search);

module.exports = router;
