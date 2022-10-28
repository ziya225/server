'use strict';

const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const Schema = mongoose.Schema;

const userSchema = new Schema(
    {
        name: { type: String },
        salutation: { type: String },
        email: { type: String },
        mobile: { type: String },
        languages: { type: String },
        city: { type: String },
        profilePic: String,
        notificationConsent: {
            whatsapp: { type: Boolean, default: true },
            text: { type: Boolean, default: true },
            email: { type: Boolean, default: true },
        },
        address: {
            addLine1: String,
            addLine2: String,
            city: String,
            state: String,
            pincode: Number,
        },
        role: {type: String, enum: ['patient', 'doctor', 'admin']},
        active: { type: Boolean, default: true },
        deleted: { type: Boolean, default: false },
        password: String,
    },
    { timestamps: true, collection: 'user' }
);

userSchema.methods.generateAuthToken = function () {
    const token = jwt.sign(
        { _id: this._id, role: this.role },
        process.env.JWT_SECRET_KEY
    );
    return token;
};

module.exports = mongoose.model('User', userSchema);
