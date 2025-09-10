//body Dùng để khai báo và kiểm tra dữ liệu trong request body (req.body).
const { body, validationResult } = require("express-validator");

//Middleware validate dữ liệu của Pet
const validatePet =
[
//body cho phép bạn viết các rule validate:
//Không bỏ trống. Không chấp nhận khoảng trắng
//.withMessage sẽ gửi qua msg:"" trong JSON trả vê
//.exists() bat chong not null va khong khai bao
//.notEmpty() khong duoc bo trong
 body("name")
    .exists().withMessage("Name field is required")
    .trim()
    .notEmpty().withMessage("Name cannot be empty"),

  body("species")
    .exists().withMessage("Species field is required")
    .trim()
    .notEmpty().withMessage("Species cannot be empty"),

  body("breed")
    .exists().withMessage("Breed field is required")
    .trim()
    .notEmpty().withMessage("Breed cannot be empty"),

  body("age")
    .exists().withMessage("Age field is required")
    .notEmpty().withMessage("Age cannot be empty")
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
    .exists().withMessage("Gender field is required")
    .notEmpty().withMessage("Gender cannot be empty")
    .toLowerCase()
    .isIn(["male", "female", "unknown"])
    .withMessage("Gender must be 'male', 'female', or 'unknown'"),

  // middleware cuối gom lỗi 
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: errors.array(),
      });
    }
    //Nếu bạn không gọi next(), request sẽ bị “kẹt” trong middleware đó và không bao giờ chạy tiếp đến controller.
    next();
  }
];

module.exports = { validatePet };