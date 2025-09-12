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


appointmentSchema.pre('save', async function (next) {
  if (this.isModified('appointment_time') || this.isNew) {
    const Appointment = mongoose.model('Appointment');
    const count = await Appointment.countDocuments({
      vet_id: this.vet_id,
      appointment_time: this.appointment_time,
      status: 'scheduled'
    });
    if (count >= 4) {
      return next(new Error('This vet already has 4 scheduled appointments at this time.'));
    }
  }
  next();
});
module.exports = mongoose.model("Appointment", appointmentSchema);
