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
    maxlength: 1000 
  },

  stock_quantity: { 
    type: Number, 
    required: true, 
    min: 0 
  },
  createdAt: { type: Date, default: Date.now }
}, { 
  timestamps: true 
});

module.exports = mongoose.model("Product", productSchema);
