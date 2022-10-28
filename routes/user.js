const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { auth } = require('../middlewares/auth');
const { admin } = require('../middlewares/admin');

// routes
router.get('/me', auth, userController.getCurrentUser);
router.post('/register', userController.register);
router.post('/auth', userController.auth);
router.post('/forgotPass', userController.forgotPass);
router.get('/getAllDoctors', auth, admin, userController.getAllDoctors);
router.get('/getAllPatients', auth, admin, userController.getAllPatients);
router.put('/:id', auth, userController.update);

module.exports = router;
