const mongoose = require("mongoose");

const healthRecordSchema = new mongoose.Schema({
  owner_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  pet_id: { type: mongoose.Schema.Types.ObjectId, ref: "Pet", required: true },

  allergies: { type: String },   // lưu chuổi string

  vaccinations: [
    {
      vaccine_name: { type: String, required: true },
      date: { type: Date, required: true },
      vet_name: { type: String, required: true }
    }
  ],

  treatments: [
    {
      symptoms: { type: String },
      diagnosis: { type: String },
      treatment: { type: String },
      vet_name:   {type: String},
      attachments: [{ type: String }] // lưu nhiều file (link, path, base64)
       
    }
  ],
  isDeleted: {
    type: Boolean,
    default: false
  },

  insurance: [{ type: String }] // lưu nhiều bảo hiểm (mỗi item là string)
}, { timestamps: true });

module.exports = mongoose.model("HealthRecord", healthRecordSchema);
