const { body, validationResult } = require("express-validator");

const validAdopt = [
  body("pet_name")
    .exists().withMessage("Pet name is required.")
    .trim().notEmpty().withMessage("Pet name cannot be empty."),

  body("species")
    .exists().withMessage("Species is required.")
    .trim().notEmpty().withMessage("Species cannot be empty."),

  body("breed")
    .exists().withMessage("Pet breed is required.")
    .trim().notEmpty().withMessage("Breed cannot be empty."),

  body("age")
    .exists().withMessage("Pet age is required.")
    .isInt({ min: 0 }).withMessage("Age must be a positive whole number (e.g. 1, 2, 3)."),

  body("images_url")
    .exists().withMessage("Pet images are required.")
    .isArray({ min: 1, max: 10 }).withMessage("Images must be sent as an array with at least 1 element."),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

const validAdoptUpdate = [
  body("pet_name").optional().trim().notEmpty().withMessage("Pet name cannot be empty."),
  body("species").optional().trim().notEmpty().withMessage("Species cannot be empty."),
  body("breed").optional().trim().notEmpty().withMessage("Breed cannot be empty."),
  body("age").optional().isInt({ min: 0 }).withMessage("Age must be a positive whole number."),
  body("images_url").optional().isArray({ min: 1, max: 10 }).withMessage("Images must be an array."),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

module.exports = {
  validAdopt,
  validAdoptUpdate
};
