const {body, validationResult} = require('express-validator');

const validationAdmin = [
    body('username').trim().notEmpty().withMessage('Username cannot be empty'),
    body('password').trim().notEmpty().withMessage('Password cannot be empty'),
    body('confirmPassword').trim().notEmpty().withMessage('Confirm Password cannot be empty')
        .custom((value, {req}) => {
            if (value !== req.body.password) {
                throw new Error('Confirm Password must match Password');
            }
            return true;
        }),
    body('role').optional().isIn(['admin']).withMessage('Role must be one of admin'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
]

module.exports = {
    validationAdmin
}