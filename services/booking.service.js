const User = require('../models/user');
const DoctorDetail = require('../models/doctorDetail');
const Booking = require('../models/booking');
const moment = require('moment');
module.exports.bookAppointment = bookAppointment;
module.exports.getBookingsByDate = getBookingsByDate;
module.exports.updateBookingStatus = updateBookingStatus;
module.exports.getBookingsByFromAndToTime = getBookingsByFromAndToTime;


/**
 * @async
 * @description booking appointment
 * @param {*} bookingId
 * @param {*} patientId
 * @param {*} doctorId
 * @param {*} meta
 * @param {*} from 
 * @param {*} to
 * @returns
 */
async function bookAppointment(
    bookingId,
    patientId,
    doctorId,
    meta,
    from,
    to
) {
    try {
        // todo : check if timings fit doc time slot
        const docDetail = await DoctorDetail.findById(doctorId);
        if(docDetail && docDetail.availableSlots) {
            if(
                moment(from).utc().isBefore(moment(docDetail.availableSlots.from).utc()) || 
                moment(from).utc().isAfter(moment(docDetail.availableSlots.to).utc()) ||
                moment(to).utc().isBefore(moment(docDetail.availableSlots.from).utc()) ||
                moment(to).utc().isAfter(moment(docDetail.availableSlots.to).utc()) 
            ){
                throw 'No Available slots for current timings.';
    
            }
        }

        
        const query = {
            doctorId,
            $or: [
                { from: { $gte: moment(from).utc(), $lt: moment(to).utc().toDate() } },
                { to: { $gte: moment(from).utc(), $lt: moment(to).utc() } },
            ],
            active: true,
            status: { $ne: 'Cancelled' }
        }
        const isPreBooked = await Booking.find(query);

        if (isPreBooked && isPreBooked.length > 0) {
            throw 'Booking Colliding with Current Booking Timings';
        }

        let booking = new Booking({
            bookingId,
            patientId,
            doctorId,
            meta,
            from: moment(from).utc(),
            to: moment(to).utc()
        });
        booking = await booking.save();
        return booking;
    } catch (error) {
        console.error('Error on Booking service: ', error);
        throw error;
    }
}

/**
 * @async
 * @description get booking appointment by date
 * @param {*} date
 * @param {*} doctorId
 * @returns
 */
async function getBookingsByDate(date, doctorId) {
    try {
        const startTime = moment(date).utc().startOf('day')
        const endTime = moment(date).utc().endOf('day')
        const query = {
            doctorId,
            from: { $gte: startTime, $lt: endTime },
            active: true,
            status: { $ne: 'Cancelled' }
        }
        const bookings = await Booking.find(query);
        return bookings;
    } catch (error) {
        console.error('Error on Booking service: ', error);
        throw error;
    }
}

/**
 * @async
 * @description get booking appointment by date
 * @param {*} date
 * @param {*} doctorId
 * @returns
 */
async function getBookingsByFromAndToTime(from, to, doctorId) {
    try {
        const query = {
            doctorId,
            $or: [
                { from: { $gte: moment(from).utc(), $lt: moment(to).utc() } },
                { to: { $gte: moment(from).utc(), $lt: moment(to).utc() } },
            ],
            active: true,
            status: { $ne: 'Cancelled' }
        }
        const bookings = await Booking.find(query);
        return bookings;
    } catch (error) {
        console.error('Error on Booking service: ', error);
        throw error;
    }
}

/**
 * @async
 * @description get booking appointment by date
 * @param {*} bookingId
 * @param {*} status
 * @returns
 */
async function updateBookingStatus(bookingId, status) {
    try {
        const query = {
            _id: bookingId
        }
        const updatedBooking = await Booking.updateOne(query, { status: status });
        if (updatedBooking && updatedBooking.modifiedCount) {
            return { bookingId, status };
        } else {
            throw updatedBooking;
        }
    } catch (error) {
        console.error('Error on Booking service: ', error);
        throw error;
    }
}

