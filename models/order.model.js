const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  total_amount: { 
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ["cart", "ordered", "complete", "cancelled"],
    default: "cart"
  },
  isDeleted: {
    type: Boolean,
    default: false
  },
  order_date: { 
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { 
  timestamps: true 
});

module.exports = mongoose.model("Order", orderSchema);
