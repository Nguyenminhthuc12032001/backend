const { body, validationResult } = require("express-validator");

const validProduct = [
  body("name")
    .exists().withMessage("Product name is required.")
    .trim().notEmpty().withMessage("Product name cannot be empty."),

  body("category")
    .exists().withMessage("Product category is required.")
    .trim().notEmpty().withMessage("Product category cannot be empty."),

  body("price")
    .exists().withMessage("Price is required.")
    .isDecimal({ decimal_digits: "0,2" })
    .withMessage("Price must be a valid number (e.g. 10.99)."),

  body("description")
    .exists().withMessage("Product description is required.")
    .trim().notEmpty().withMessage("Description cannot be empty."),

  body("stock_quantity")
    .exists().withMessage("Stock quantity is required.")
    .isInt({ min: 0 })
    .withMessage("Stock quantity must be a positive integer."),

  body("images_url")
    .exists().withMessage("Product images are required.")
    .isArray({ min: 1 })
    .withMessage("Images must be provided as an array with at least 1 item."),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

const validProductUpdate = [
  body("name").optional().trim().notEmpty().withMessage("Product name cannot be empty."),
  body("category").optional().trim().notEmpty().withMessage("Product category cannot be empty."),
  body("price").optional().isDecimal({ decimal_digits: "0,2" }).withMessage("Price must be a valid number (e.g. 10.99)."),
  body("description").optional().trim().notEmpty().withMessage("Product description cannot be empty."),
  body("stock_quantity").optional().isInt({ min: 0 }).withMessage("Stock quantity must be a positive integer."),
  body("images_url").optional().isArray().withMessage("Product images must be an array."),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

module.exports = {
  validProduct,
  validProductUpdate,
};
