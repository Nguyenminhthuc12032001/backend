const router = require("express").Router();
const healthRecordController = require("../controllers/health_record.controller");
const { verifyToken } = require("../middlewares/authentication.middlewares");

router.post("/create", verifyToken, healthRecordController.createNew);
router.get("/getAll/", verifyToken, healthRecordController.getAll);
router.get("/getByPet/:petId", verifyToken, healthRecordController.getByPet);
router.put("/update/:id", verifyToken, healthRecordController.update);
router.delete("/delete/:id", verifyToken, healthRecordController.remove);

module.exports = router;