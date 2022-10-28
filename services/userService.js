'use strict';

const bcrypt = require('bcrypt');

// model imports
const User = require('../models/user');

// public interface
module.exports.register = register;
module.exports.auth = auth;
module.exports.update = update;
module.exports.getUserById = getUserById;
module.exports.getAllPatients = getAllPatients;
module.exports.getAllDoctors = getAllDoctors;

/**
 * @async
 * @description registers user
 * @param {*} name
 * @param {*} email
 * @param {*} password
 * @returns
 */
async function register(name, email, password, mobile, role = 'patient') {
    try {

        // if role is doctor
        // create doctor record userId attacj

        // email check
        let user = await User.findOne({ email });

        if (user) throw 'User already registered';

        // creating new user
        user = new User({
            name,
            email,
            password,
            mobile,
            role
        });

        user.password = await bcrypt.hash(user.password, 10);

        user = await user.save();

        // // take out password before returning
        // const { password: remove, ...restUser } = user;
        return user;
    } catch (err) {
        console.error('Error on register service: ', err);
        throw err;
    }
}

/**
 * @async
 * @param {*} email
 * @param {*} password
 */
async function auth(mobile, password) {
    try {
        let user = await User.findOne({ mobile });

        if (!user) throw 'Invalid email or password';

        const validPass = await bcrypt.compare(password, user.password);

        if (!validPass) throw 'Invalid email or password';

        return user;
    } catch (err) {
        console.error('Error on login service: ', err);
        throw err;
    }
}

/**
 * @async
 * @param {*} userId
 */
async function getUserById(userId) {
    try {
        if (!userId) throw 'userId missing';

        const user = await User.findById(userId).select('-password');
        return user;
    } catch (err) {
        console.error('Error on getUserById service: ', err);
        throw err;
    }
}


/**
 * @async
 * @description get All Patients for admin
 */
 async function getAllPatients(limit, offset) {
    try {
        const users = await User.find({
            role: 'patient',
            active: true
        })
        .select('-password')
        .sort({_id: -1})
        .limit(limit)
        .skip(offset);

        return users;
    } catch (err) {
        console.error('Error on User service: ', err);
        throw err;
    }
}

/**
 * @async
 * @description get All Doctors for admin
 */
 async function getAllDoctors(limit, offset) {
    try {
        const users = await User.find({
            role: 'doctor',
            active: true
        })
        .select('-password')
        .sort({_id: -1})
        .limit(limit)
        .skip(offset);

        return users;
    } catch (err) {
        console.error('Error on User service: ', err);
        throw err;
    }
}

async function update(id, user) {
    try {
        if (!id || !user) throw 'required data missing';

        user = await User.findByIdAndUpdate(id, user, {
            new: true,
        });

        if (!user) throw 'user not found';

        console.log({ user });
        return user;
    } catch (err) {
        console.error('Error on update user service: ', err);
        throw err;
    }
}