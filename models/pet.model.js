const mongoose = require("mongoose");

const petSchema = new mongoose.Schema({
  owner_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true },
  species: { type: String, required: true },
  breed: { type: String },
  age: { type: Number, min: 0 },
  gender: { 
    type: String, 
    enum: ["male", "female", "unknown"], 
    default: "unknown" 
  },
  description: { type: String },
}, { timestamps: true });

module.exports = mongoose.model("Pet", petSchema);