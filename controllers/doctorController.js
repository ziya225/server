'use strict';

const utils = require('../helpers/utils');
const userService = require('../services/userService');
const doctorService = require('../services/doctorService');
const bookingService = require('../services/booking.service');

module.exports.getById = getById;
module.exports.getByUserId = getByUserId;
module.exports.getAll = getAll;
module.exports.create = create;
module.exports.update = update;
module.exports.deleteOne = deleteOne;
module.exports.register = register;
module.exports.bookAppointment = bookAppointment;
module.exports.getBookingsByDate = getBookingsByDate;
module.exports.getBookingsByFromAndToTime = getBookingsByFromAndToTime;
module.exports.updateAppointmentStatus = updateAppointmentStatus;
module.exports.getUnverified = getUnverified;
module.exports.verify = verify;

/**
 * @async
 * @description Request handler for fetching doctor
 * @param {Express.Request} req
 * @param {Express.Response} res
 */
async function getById(req, res) {
    try {
        const { id } = req.params;
        const doctor = await doctorService.get(id);
        res.json(utils.formatResponse(1, doctor));
    } catch (err) {
        console.error('Error on doctor getById handler: ', err);
        res.json(utils.formatResponse(0, err));
    }
}

/**
 * @async
 * @description Request handler for fetching doctor by userId
 * @param {Express.Request} req
 * @param {Express.Response} res
 */
async function getByUserId(req, res) {
    try {
        console.log('here010');
        const { id } = req.params;
        const doctor = await doctorService.getByUserId(id);
        res.json(utils.formatResponse(1, doctor));
    } catch (err) {
        console.error('Error on doctor getByUserId handler: ', err);
        res.json(utils.formatResponse(0, err));
    }
}

/**
 * @async
 * @description Request handler for fetching doctors
 * @param {Express.Request} req
 * @param {Express.Response} res
 */
async function getAll(req, res) {
    try {
        const doctors = await doctorService.getAll();
        res.json(utils.formatResponse(1, doctors));
    } catch (err) {
        console.error('Error on doctor getAll handler: ', err);
        res.json(utils.formatResponse(0, err));
    }
}

/**
 * @async
 * @description Request handler for create doctor
 * @param {Express.Request} req
 * @param {Express.Response} res
 */
async function create(req, res) {
    try {
        const data = req.body;
        const doctor = await doctorService.create(data);
        res.json(utils.formatResponse(1, doctor));
    } catch (err) {
        console.error('Error on doctor create handler: ', err);
        res.json(utils.formatResponse(0, err));
    }
}

/**
 * @async
 * @description Request handler for update doctor
 * @param {Express.Request} req
 * @param {Express.Response} res
 */
async function update(req, res) {
    try {
        const { id } = req.params;
        let doctor = req.body;
        doctor = await doctorService.update(id, doctor);
        res.json(utils.formatResponse(1, doctor));
    } catch (err) {
        console.error('Error on doctor update handler: ', err);
        res.json(utils.formatResponse(0, err));
    }
}

/**
 * @async
 * @description Request handler for delete doctor
 * @param {Express.Request} req
 * @param {Express.Response} res
 */
async function deleteOne(req, res) {
    try {
        const { id } = req.params;
        await doctorService.deleteOne(id);
        res.json(utils.formatResponse(1));
    } catch (err) {
        console.error('Error on doctor deleteOne handler: ', err);
        res.json(utils.formatResponse(0, err));
    }
}

/**
 * @async
 * @description Request handler for registering Doc
 * @param {Express.Request} req
 * @param {Express.Response} res
 */
async function register(req, res) {
    try {
        const { name, email, password } = req.body;
        const user = await userService.register(
            name,
            email,
            password,
            'doctor'
        );
        const token = user.generateAuthToken();
        res.header('x-auth-token', token);
        res.json(utils.formatResponse(1, user));
    } catch (err) {
        console.error('Error on register handler: ', err);
        res.json(utils.formatResponse(0, err));
    }
}

/**
 * @async
 * @description Request handler for booking doc appointment
 * @param {Express.Request} req
 * @param {Express.Response} res
 */
async function bookAppointment(req, res) {
    try {
        const { bookingId, patientId, doctorId, meta, from, to } = req.body;
        const newBooking = await bookingService.bookAppointment(
            bookingId,
            patientId,
            doctorId,
            meta,
            from,
            to
        );
        res.json(utils.formatResponse(1, newBooking));
    } catch (err) {
        console.error('Error on register handler: ', err);
        res.json(utils.formatResponse(0, err));
    }
}
/**
 * @async
 * @description Request handler for booking doc appointment
 * @param {Express.Request} req
 * @param {Express.Response} res
 */
async function getBookingsByDate(req, res) {
    try {
        const { date, doctorId } = req.body;
        const bookings = await bookingService.getBookingsByDate(date, doctorId);
        res.json(utils.formatResponse(1, bookings));
    } catch (err) {
        console.error('Error on register handler: ', err);
        res.json(utils.formatResponse(0, err));
    }
}
/**
 * @async
 * @description Request handler for booking doc appointment
 * @param {Express.Request} req
 * @param {Express.Response} res
 */
async function getBookingsByFromAndToTime(req, res) {
    try {
        const { from, to, doctorId } = req.body;
        const bookings = await bookingService.getBookingsByFromAndToTime(
            from,
            to,
            doctorId
        );
        res.json(utils.formatResponse(1, bookings));
    } catch (err) {
        console.error('Error on register handler: ', err);
        res.json(utils.formatResponse(0, err));
    }
}

/**
 * @async
 * @description Request handler for booking doc appointment
 * @param {Express.Request} req
 * @param {Express.Response} res
 */
async function updateAppointmentStatus(req, res) {
    try {
        const { bookingId, status } = req.body;
        const newBooking = await bookingService.updateBookingStatus(
            bookingId,
            status
        );
        res.json(utils.formatResponse(1, newBooking));
    } catch (err) {
        console.error('Error on register handler: ', err);
        res.json(utils.formatResponse(0, err));
    }
}

async function getUnverified(req, res) {
    try {
        const doctors = await doctorService.getUnverified();
        res.json(utils.formatResponse(1, doctors));
    } catch (err) {
        console.error('Error on doctor getUnverified handler: ', err);
        res.json(utils.formatResponse(0, err));
    }
}

async function verify(req, res) {
    try {
        const { id } = req.params;
        doctor = await doctorService.verify(id);
        res.json(utils.formatResponse(1, doctor));
    } catch (err) {
        console.error('Error on doctor verify handler: ', err);
        res.json(utils.formatResponse(0, err));
    }
}
