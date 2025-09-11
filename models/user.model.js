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
        default: 'owner'
    },
    is_verified: { 
        type: Boolean, 
        default: false 
    },
    versionToken: { 
        type: Number, 
        default: 0 
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
})

userSchema.pre('save', async function (next) {
    if (this.isModified('password_hash')) {
        this.password_hash = await bcrypt.hash(this.password_hash, 10);
    }
    next();
})

userSchema.methods.comparePassword = async function (inputPassword) {
    return await bcrypt.compare(inputPassword, this.password_hash);
}

module.exports = mongoose.model('User', userSchema);