const router = require('express').Router();
const { verifyToken, checkRole } = require('../middlewares/authentication.middlewares');
const adoptionListingController = require('../controllers/adoptionListing.controller');
const { body, validationResult } = require('express-validator');

router.post('/createNew', 
    [
        verifyToken, 
        checkRole('shelter'),
        body('pet_name').isString().notEmpty().withMessage('Pet name is required'),
        body('species').isString().notEmpty().withMessage('Species is required'),
        body('age').optional().isInt({ min: 0 }).withMessage('Age must be a non-negative number'),
        body('status').optional().isIn(['available', 'adopted', 'pending']).withMessage('Invalid status'),
        (req, res, next) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            next();
        }
    ],
    adoptionListingController.createNew
);

router.get('/getAll', 
    [verifyToken, checkRole('admin')], 
    adoptionListingController.getAll
);

router.get('/get/:id', 
    [verifyToken, checkRole('admin')], 
    adoptionListingController.get
);

router.put('/update/:id', 
    [
        verifyToken, 
        checkRole('shelter'),
        body('age').optional().isInt({ min: 0 }).withMessage('Age must be non-negative'),
        body('status').optional().isIn(['available', 'adopted', 'pending']).withMessage('Invalid status'),
        (req, res, next) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            next();
        }
    ], 
    adoptionListingController.update
);

router.delete('/remove/:id', 
    [verifyToken, checkRole('admin')], 
    adoptionListingController.remove
);

router.get('/search', 
    [verifyToken],
    adoptionListingController.search
);

module.exports = router;
