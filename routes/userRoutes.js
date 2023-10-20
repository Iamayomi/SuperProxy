const express = require('express');
const googleController = require('../controllers/google-auth');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');


const router = express.Router();



router.route('/signingup').post(authController.signup);
router.route('/signingin').post(authController.signin);
router.use(authController.protect);

router.route('/updateProfile').patch(userController.uploadUserPhoto, userController.updateMe);

router.route('/verifyId').post(authController.verifyId);

router.route('/verifyPhone').post(authController.verifyPhone);

router.route('/verifyPhoneOTP').patch(authController.verifyPhoneOTP);




router
    .route('/google')
    .get(googleController.google);

router
    .route('/google/callback')
    .get(googleController.callback);


router
    .route('/failed')
    .get(googleController.failed);


router
    .route('/success')
    .get(googleController.isLoggedIn, googleController.success);


module.exports = router;
