const mongoose = require("mongoose");
const HealthRecord = require("../models/health_record.model");

// ✅ Tạo mới Health Record
const createNew = async (req, res) => {
  try {
    // Lấy owner_id từ token đã verify
    const owner_id = req.user.id;

    // Lấy dữ liệu từ body
    const { pet_id, allergies, vaccinations, treatments, insurance } = req.body;

    // Tạo record mới
    const newRecord = new HealthRecord({
      owner_id,       // gán chủ sở hữu từ token
      pet_id,
      allergies,
      vaccinations,
      treatments,
      insurance
    });

    await newRecord.save();

    return res.status(201).json({
      msg: "Health record created successfully",
      record: newRecord
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// ✅ Lấy tất cả Health Records
const getAll = async (req, res) => {
  try {
    userid =  req.user.id;
    console.log(userid);
    const records = await HealthRecord.find({ owner_id: userid }).populate("pet_id", "name species");
    return res.status(200).json({ records });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// ✅ Lấy record theo pet_id
const getByPet = async (req, res) => {
  try {
    const { petId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(petId)) {
      return res.status(400).json({ msg: "Invalid Pet ID format" });
    }

    const records = await HealthRecord.find({ pet_id: petId });
    if (!records || records.length === 0) {
      return res.status(404).json({ msg: "No health records found for this pet" });
    }

    return res.status(200).json({ records });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// ✅ Cập nhật Health Record
const update = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ msg: "Invalid Record ID format" });
    }

    const updated = await HealthRecord.findByIdAndUpdate(id, req.body, { new: true });
    if (!updated) {
      return res.status(404).json({ msg: "Health record not found" });
    }

    return res.status(200).json({ msg: "Health record updated successfully", record: updated });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// ✅ Xóa Health Record
const remove = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ msg: "Invalid Record ID format" });
    }

    const result = await HealthRecord.deleteOne({ _id: id });
    if (result.deletedCount === 0) {
      return res.status(404).json({ msg: "Health record not found, unable to delete" });
    }

    return res.status(200).json({ msg: "Health record deleted successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createNew,
  getAll,
  getByPet,
  update,
  remove
};
