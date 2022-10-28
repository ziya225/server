'use strict';

const mongoose = require('mongoose');
const user = require('./user');
const Schema = mongoose.Schema;

// const bookingStatus = ['PendingConfirmation', 'Confirm', 'Cancelled', 'Completed'];


const bookingSchema = new Schema(
    {
        bookingId: String, // custom id
        patientId: {type: mongoose.Types.ObjectId, ref: user},
        doctorId: {type: mongoose.Types.ObjectId, ref: user},
        meta: String,
        from: Date,
        to: Date,
        fees: Number,
        status: {type: String, enum: ['PendingConfirmation', 'Confirm', 'Cancelled', 'Completed'], default: 'PendingConfirmation'},
        active: { type: Boolean, default: true },
    },
    { timestamps: true, collection: 'booking' }
);

module.exports = mongoose.model('Booking', bookingSchema);
