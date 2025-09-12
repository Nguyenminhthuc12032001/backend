const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  user_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  total_amount: { 
    type: Number,
    required: true, 
    min: 0 
  },
  status: { 
    type: String,
    enum: ["pending", "paid", "shipped", "completed", "cancelled"], 
    default: "pending" 
  },
  isDeleted: {
    type: Boolean,
    default: false
  },
  order_date: { 
    type: Date, 
    default: Date.now 
  }
}, { 
  timestamps: true 
});

module.exports = mongoose.model("Order", orderSchema);
