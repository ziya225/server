'use strict';

const utils = require('../helpers/utils');
const userService = require('../services/userService');
const user = require('../models/user');

// public interface
module.exports.register = register;
module.exports.auth = auth;
module.exports.forgotPass = forgotPass;
module.exports.getCurrentUser = getCurrentUser;
module.exports.getAllPatients = getAllPatients;
module.exports.getAllDoctors = getAllDoctors;
module.exports.update = update;

/**
 * @async
 * @description Request handler for registering user
 * @param {Express.Request} req
 * @param {Express.Response} res
 */
async function register(req, res) {
    try {
        const { name, email, password, mobile, role } = req.body;
        const user = await userService.register(name, email, password, mobile, role);
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
 * @description Request handler for user login
 * @param {Express.Request} req
 * @param {Express.Response} res
 */
async function auth(req, res) {
    try {
        const { mobile, password } = req.body;
        const user = await userService.auth(mobile, password);
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
 * @description Request handler for resetting user pass
 * @param {Express.Request} req
 * @param {Express.Response} res
 */
async function forgotPass(req, res) {
    try {
        res.json(utils.formatResponse(1, user));
    } catch (err) {
        console.error('Error on register handler: ', err);
        res.json(utils.formatResponse(0, err));
    }
}

/**
 * @async
 * @description Request handler for fetching current user
 * @param {Express.Request} req
 * @param {Express.Response} res
 */
async function getCurrentUser(req, res) {
    try {
        // const { _id: userIdFromUser } = req.user;
        const { _id: userId } = req.body;
        const user = await userService.getUserById(userId);
        res.json(utils.formatResponse(1, user));
    } catch (err) {
        console.error('Error on getCurrentUser handler: ', err);
        res.json(utils.formatResponse(0, err));
    }
}

/**
 * @async
 * @description Request handler for fetching current user
 * @param {Express.Request} req
 * @param {Express.Response} res
 */
async function getAllDoctors(req, res) {
    try {
        const {limit, offset} = req.query;
        const users = await userService.getAllDoctors(limit|| 100, offset || 0);
        res.json(utils.formatResponse(1, users));
    } catch (err) {
        console.error('Error on get All Doctors handler: ', err);
        res.json(utils.formatResponse(0, err));
    }
}

/**
 * @async
 * @description Request handler for fetching current user
 * @param {Express.Request} req
 * @param {Express.Response} res
 */
async function getAllPatients(req, res) {
    try {
        const {limit, offset} = req.query;
        const users = await userService.getAllPatients(limit || 100, offset|| 0);
        res.json(utils.formatResponse(1, users));
    } catch (err) {
        console.error('Error on getCurrentUser handler: ', err);
        res.json(utils.formatResponse(0, err));
    }
}

async function update(req, res) {
    try {
        const { id } = req.params;
        let user = req.body;
        user = await userService.update(id, user);
        res.json(utils.formatResponse(1, user));
    } catch (err) {
        console.error('Error on user update handler: ', err);
        res.json(utils.formatResponse(0, err));
    }
}

