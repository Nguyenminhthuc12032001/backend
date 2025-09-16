const { body, validationResult } = require('express-validator');

const validOrder = [
  body("user_id")
    .exists().withMessage("User ID is required.")
    .notEmpty().withMessage("User ID cannot be empty.")
    .trim(),

  body("total_amount")
    .exists().withMessage("Total amount is required.")
    .isInt({ min: 1 }).withMessage("Total amount must be a positive whole number (e.g. 100)."),

  body("items")
    .exists().withMessage("List of items is required.")
    .isArray({ min: 1, max: 100 }).withMessage("Items must be an array with at least 1 element."),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

const validOrderUpdate = [
  body("user_id").optional().notEmpty().withMessage("User ID cannot be empty.").trim(),
  body("total_amount").optional().isInt({ min: 1 }).withMessage("Total amount must be a positive whole number."),
  body("items").optional().isArray({ min: 1, max: 100 }).withMessage("Items must be an array."),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];


module.exports = {
    validOrder,
    validOrderUpdate
}