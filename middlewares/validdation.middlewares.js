const {body, validationResult} = require('express-validator');

const validationMovie = [
    body('title').trim().notEmpty().withMessage('Title cannot be empty'),
    body('genre').trim().notEmpty().withMessage('Genre cannot be empty'),
    body('releaseYear').isInt({min: 1900, max: new Date().getFullYear()}).withMessage('Release Year must be between 1900 and current year'),
    body('director').trim().notEmpty().withMessage('Director cannot be empty'),
    body('rating').isInt({min: 1, max: 10}).withMessage('Rating must be between 1 and 10'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()});
        }
        next();
    }
]

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
    body('role').optional().isIn(['admin', 'superAdmin', 'moderator']).withMessage('Role must be one of admin, superAdmin, or moderator'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
]

module.exports = {
    validationMovie,
    validationAdmin
}