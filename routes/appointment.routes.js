const router = require('express').Router();
const { verifyToken, checkRole } = require('../middlewares/authentication.middlewares');
const appointmentController = require('../controllers/appointment.controller');
const { body, validationResult } = require('express-validator');

router.post('/createNew',
    [
        verifyToken,
        checkRole('owner'),
        body('appointment_time').isISO8601().withMessage('Invalid date'),
        body('status').optional().isIn(['scheduled','completed','cancelled','missed']).withMessage('Invalid status'),
        (req, res, next) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            next();
        }
    ],
    appointmentController.createNew
);

router.get('/getAll', [verifyToken, checkRole('admin')], appointmentController.getAll);

router.get('/get/:id', [verifyToken], appointmentController.get);

router.put('/update/:id',
    [
        verifyToken,
        checkRole('owner'),
        body('status').optional().isIn(['scheduled','completed','cancelled','missed']).withMessage('Invalid status'),
        (req, res, next) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            next();
        }
    ],
    appointmentController.update
);

router.delete('/remove/:id', [verifyToken, checkRole('admin')], appointmentController.remove);

router.get('/search', [verifyToken], appointmentController.search);

router.post('/setcompleted/:id', [verifyToken, checkRole('vet')], appointmentController.completeCase);

module.exports = router;
