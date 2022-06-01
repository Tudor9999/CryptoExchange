const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        //required: true,
        unique: true,
        trim: true,
        minlength: 4
    },
    email: {
        type: String,
        //required: true,
        unique: true
    },
    password: {
        type: String,
        //required: true,
        unique: true
    },
    phone :{
        type: Number,
        //required: true
    },
    provider: {
        type: String,
        enum: ["github", "google", "default"],
        default: "default",
    },
    createdAt: { type: Date, default: Date.now },
    lastLogin: { type: Date, default: Date.now },
}, {
    timestamps: true,
});

const User = mongoose.model('User', userSchema);

module.exports = User;