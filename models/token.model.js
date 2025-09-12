const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema({
    user_id: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", 
        required: true
    },
    token: { 
        type: String 
    },
    type_token: { 
        type: String,
        required: true,
        enum: ["register", "reset_password"]
    },
    verified_at: { 
        type: Date 
    },
    expireAt: { 
        type: Date, 
        default: () => Date.now() + 15*60*1000
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
})

tokenSchema.index({ expireAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model("Token", tokenSchema);