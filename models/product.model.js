const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },

  category: {
    type: String,
    required: true,
    trim: true
  },

  price: {
    type: Number,
    required: true,
    min: 0
  },

  description: {
    type: String,
    trim: true,
    maxlength: 1000
  },

  stock_quantity: {
    type: Number,
    required: true,
    min: 0
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
},
  {
    timestamps: true
  });

productSchema.pre("save", function (next) {
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

module.exports = mongoose.model("Product", productSchema);
