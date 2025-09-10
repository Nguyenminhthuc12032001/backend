const express = require("express");
const router = express.Router();

//Import petcontroller và middleware {validatePet}
const petController = require("../controllers/pet.controller");
const  {validatePet}  = require("../middlewares/pet.middleware");

// 🐶 Tạo pet mới (bắt buộc validate dữ liệu)
router.post("/createNew", validatePet, petController.createNew);

// 🐶 Lấy tất cả pets
router.get("/getAll", petController.getAll);

// 🐶 Lấy 1 pet theo id
router.get("/:id", petController.get);

// 🐶 Update pet (validate dữ liệu trước khi update)
router.put("/:id", validatePet, petController.update);

// 🐶 Delete pet
router.delete("/:id", petController.remove);

// 🐶 Search pets theo query (name, species, breed, gender)
router.get("/search/query", petController.search);

module.exports = router;
