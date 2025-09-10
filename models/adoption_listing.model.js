const mongoose = require("mongoose");

const adoptionListingSchema = new mongoose.Schema({
  shelter_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User",
    required: true 
  },
  pet_name: { 
    type: String, 
    required: true, 
    trim: true 
  },
  species: { 
    type: String, 
    required: true 
  },
  breed: { 
    type: String 
  },
  age: { 
    type: Number, 
    min: 0 
  },
  status: { 
    type: String, 
    enum: ["available", "adopted", "pending"], 
    default: "available" 
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { 
  timestamps: true 
});

module.exports = mongoose.model("AdoptionListing", adoptionListingSchema);
