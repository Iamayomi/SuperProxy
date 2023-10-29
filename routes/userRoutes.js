const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const notifyController = require('../controllers/notifyController');
const chatController = require('../controllers/chatController');

const router = express.Router();


router.route('/signingup').post(authController.signup);
router.route('/signingin').post(authController.signin);

router.use(authController.protect);

router.route('/updateProfile').patch(userController.updateMe);

router.route('/verifyId').post(authController.verifyId);

router.route('/:userId/sendNotification').post(notifyController.sendAUserNotify);

router.route('/:userId/chatting').post(chatController.sendMessage);

router.route('/getAllUser').get(userController.getAllUser);

router.route('/profile').get(userController.getAUser);

//router.route('/verifyPhone').post(authController.verifyPhone);
//
router.route('/qualification').post(userController.qualifyUser);
//
//router.route('/verifyPhoneOTP/:id').patch(authController.verifyPhoneOTP);



module.exports = router;
