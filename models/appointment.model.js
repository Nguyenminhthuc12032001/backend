const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
  pet_id: { type: mongoose.Schema.Types.ObjectId, ref: "Pet", required: true },
  owner_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  vet_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, 
  appointment_time: { type: Date, required: true },
  status: { 
    type: String, 
    enum: ["scheduled", "completed", "cancelled", "missed"], 
    default: "scheduled"
  },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model("Appointment", appointmentSchema);
