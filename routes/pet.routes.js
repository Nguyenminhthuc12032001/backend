const express = require("express");
const router = express.Router();

//Import petcontroller và middleware {validatePet}
const petController = require("../controllers/pet.controller");
const  {validatePet}  = require("../middlewares/pet.middleware");
const {verifyToken} =require("../middlewares/authentication.middlewares");

// 🐶 Tạo pet mới (bắt buộc validate dữ liệu)
router.post("/createNew", [verifyToken, validatePet], petController.createNew);

// 🐶 Lấy tất cả pets
router.get("/getAll", verifyToken, petController.getAll);

// 🐶 Lấy 1 pet theo id
router.get("/get/:id", verifyToken, petController.get);

// 🐶 Update pet (validate dữ liệu trước khi update)
router.put("/update/:id",  [verifyToken, validatePet], petController.update);

// 🐶 Delete pet
router.delete("/delete/:id", verifyToken, petController.remove);

// 🐶 Search pets theo query (name, species, breed, gender)
router.get("/search/query", verifyToken, petController.search);

//Thao tác tư viện ảnh
router.put("/addImages/:id", verifyToken, petController.addImages);
router.put("/removeImage/:id", verifyToken, petController.removeImage);

module.exports = router;
