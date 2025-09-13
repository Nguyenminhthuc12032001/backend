const { body, validationResult } = require("express-validator");

const validUser = [
  body("name")
    .trim()
    .notEmpty().withMessage("Username cannot be empty."),

  body("email")
    .trim()
    .notEmpty().withMessage("Email cannot be empty.")
    .isEmail().withMessage("Email must be a valid email address."),

  body("phone_number")
    .trim()
    .notEmpty().withMessage("Phone number cannot be empty.")
    .isMobilePhone().withMessage("Phone number must be valid."),

  body("password_hash")
    .trim()
    .notEmpty().withMessage("Password cannot be empty."),

  body("confirmPassword")
    .trim()
    .notEmpty().withMessage("Confirm Password cannot be empty.")
    .custom((value, { req }) => {
      if (value !== req.body.password_hash) {
        throw new Error("Confirm Password must match Password.");
      }
      return true;
    }),

  body("role")
    .optional()
    .isIn(["admin", "owner", "doctor", "shelter"])
    .withMessage("Role must be one of admin, owner, doctor, shelter."),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

const validUserUpdate = [
  body("name").optional().trim().notEmpty().withMessage("Username cannot be empty."),
  body("email").optional().trim().isEmail().withMessage("Email must be valid."),
  body("phone_number").optional().trim().isMobilePhone().withMessage("Phone number must be valid."),
  body("password_hash").optional().trim().notEmpty().withMessage("Password cannot be empty."),
  body("confirmPassword")
    .optional()
    .trim()
    .notEmpty().withMessage("Confirm Password cannot be empty.")
    .custom((value, { req }) => {
      if (value !== req.body.password_hash) {
        throw new Error("Confirm Password must match Password.");
      }
      return true;
    }),
  body("role")
    .optional()
    .isIn(["admin", "owner", "doctor", "shelter"])
    .withMessage("Role must be one of admin, owner, doctor, shelter."),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

module.exports = {
  validUser,
  validUserUpdate,
};
