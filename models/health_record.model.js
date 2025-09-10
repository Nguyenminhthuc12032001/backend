const mongoose = require("mongoose");

const healthRecordSchema = new mongoose.Schema({
  pet_id: { type: mongoose.Schema.Types.ObjectId, ref: "Pet", required: true },
  vet_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, 
  visit_date: { type: Date, required: true },
  diagnosis: { type: String, required: true },
  treatment: { type: String },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model("HealthRecord", healthRecordSchema);
