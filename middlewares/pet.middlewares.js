//body Dùng để khai báo và kiểm tra dữ liệu trong request body (req.body).
const { body, validationResult } = require("express-validator");

//Middleware validate dữ liệu của Pet
const validatePet =
[
//body cho phép bạn viết các rule validate:
//Không bỏ trống. Không chấp nhận khoảng trắng
body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required"),
  
  body("species")
    .trim()
    .notEmpty()
    .withMessage("Species is required"),
  
  body("age")
    .notEmpty()
    .withMessage("Age is required")
    .custom((value) => {
      if (!Number.isInteger(value)) {
        throw new Error("Age must be an integer");
      }
      if (value < 0) {
        throw new Error("Age must be >= 0");
      }
      return true;
    }),
  
  body("gender")
    .notEmpty()
    .isIn(["male", "female", "unknown"])
    .withMessage("Gender must be 'male', 'female', or 'unknown'"),
]
