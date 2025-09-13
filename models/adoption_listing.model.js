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

  images_url: [
    {
      url: {
        type: String,
        trim: true,
        required: true
      },
      alt: {
        type: String,
        trim: true
      },
      public_id: {
        type: String,
        required: true
      },
      isMain: {
        type: Boolean,
        default: false
      }
    }
  ],

  isDeleted: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { 
  timestamps: true 
});

adoptionListingSchema.pre("save", function (next) {
  if (this.images_url && this.images_url.length > 0) {
    let mainCount = 0;
    this.images_url = this.images_url.map(img => {
      if (!img.alt || img.alt.trim() === "") {
        img.alt = this.name;
      }

      if (img.isMain) {
        mainCount++;
        if (mainCount > 1) {
          img.isMain = false;
        }
      }
      return img;
    });

    if (mainCount === 0) {
      this.images_url[0].isMain = true;
    }
  }
  next();
})

module.exports = mongoose.model("AdoptionListing", adoptionListingSchema);
