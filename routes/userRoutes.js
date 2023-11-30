const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const chatController = require('../controllers/chatController');
const proposeController = require('../controllers/proposeController');

const router = express.Router({ mergeParams: true });


router.route('/createAccount').post(authController.signup);
router.route('/login').post(authController.signin);


router.delete('/:id', userController.deleteUser);


router.use(authController.protect);

router.route('/getAllUser').get(authController.restrict('admin'), userController.getAllUser);

router.route('/updateProfile').patch(userController.uploadUserPhoto, userController.updateMe);

router.route('/changeMyPassword').patch(authController.changePassword);

router.route('/forgotPassword').post(authController.forgotPassword);
router.route('/resetPassword/:token').patch(authController.resetPassword);


router.route('/verifyId').post(authController.verifyId);

router.route('/:userId/chatting').post(chatController.sendMessage);

router.route('/:userId/chats').get(chatController.allChat);

router.route('/profile').get(userController.getMe);

router.route('/verifyPhone').patch(authController.verifyPhone);

router.route('/qualification').patch(userController.updateEdu);

router.route('/deleteMe').patch(userController.delMe);

router.route('/addSkills').post(userController.addingSkills);

router.route('/:userId/sendProposal').post(proposeController.uploadUserfile, proposeController.sendAnInvite);

router.route('/:notifyId/approveProposal').get(proposeController.getInvite);

router.route('/verifyPhoneOTP').patch(authController.verifyPhoneOTP);


module.exports = router;
