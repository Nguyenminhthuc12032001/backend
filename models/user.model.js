const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    phone_number: {
        type: String,
        required: true,
        unique: true,
    },
    password_hash: {
        type: String,
        required: true,
        trim: true
    },
    role: {
        type: String,
        enum: ['admin', 'owner', 'doctor', "shelter"],
        default: 'user'
    },
    token: { type: String },
    verified_date: { type: Date },
    type_token: { 
        type: String,
        enum: ["register", "reset_password"]
    },
    is_verified: { type: Boolean, default: false },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
})

adminSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
})

adminSchema.methods.comparePassword = async function (inputPassword) {
    return await bcrypt.compare(inputPassword, this.password);
}

module.exports = mongoose.model('User', userSchema);