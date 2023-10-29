const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const verifyId = require('../models/verifyIdModel');
const phoneVerify = require('../models/phoneModel');
const { promisify } = require('util');

const signToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
};

const cookiesOptions = {
    expires: new Date(Date.now() + process.env.JWT_COOKIEs_EXPIRES * 24 * 60 * 60 * 1000),
    httpOnly: true,
    sameSite: 'lax'
};

if (process.env.NODE_ENV === 'production') cookiesOptions.secure = true;

exports.signup = async function (req, res, next) {
    try {
        const newUser = await User.create({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            state: req.body.state,
            gender: req.body.gender,
            location: req.body.location,
            role: req.body.role,
            lookingFor: req.body.lookingFor,
            password: req.body.password,
            confirmPassword: req.body.confirmPassword
        });

        const token = signToken(newUser._id);

        res.cookie('jwt', cookiesOptions);

        res.status(201).json({
            status: "Success",
            token,
            data: {
                user: newUser
            }
        });

    } catch (error) {
        next(res.status(400).send(error.message));
    }

};


exports.signin = async function (req, res, next) {
    try {
        const { email, password } = req.body;

        if (!email || !password) return next(res.status(201).send("please provide an email and password"));

        const user = await User.findOne({ email }).select('+password');

        if (!user || !(await user.comparePassword(password, user.password))) {
            return next(res.status(400).send('incorrect email or password'));
        };

        const token = signToken(user._id);

        res.cookie('jwt', cookiesOptions);

        res.status(200).json({
            status: 'success',
            token
        })

    } catch (error) {
        next(res.status(400).send(error.message));
    }
};


exports.protect = async function (req, res, next) {
    let token;

    if (req.headers.authorization?.startsWith('Bearer'))
        token = req.headers.authorization.split(' ')[1];

    if (!token) {
        res.status(401).send('You are not logged in, Please log in to get access')
    };

    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    const currentUser = await User.findById(decoded.id);

    if (!currentUser) {
        next(res.status(401).send('This user token does not longer exist'));
    };

    if (currentUser.checkPasswordChangedAt(decoded.iat)) {
        next(res.status(401).send('User recently changed password! please log in again.'));
    };

    req.user = currentUser;
    next();
};



exports.changePassword = async function () {
    const user = await User.findById(req.user.id).select('+password');

    if (!(await user.comparePassword(req.body.oldPassword, user.password))) {
        res.status(401).send('Your current password is wrong')
    };

    user.password = req.body.newPassword;
    user.confirmPassword = req.body.confirmNewPassword;
    await user.save();

    const token = signToken(user._id);

    res.cookie('jwt', cookiesOptions);


    res.status(200).json({
        status: "Success",
        token,
        data: {
            user: user
        }
    });

};


exports.restrict = function (...role) {
    return function (req, res, next) {
        if (!role.includes(req.user.role)) {
            return next(res.status(403).send('You are not given permission to perform this action'))
        };
        next();
    };
};


exports.verifyId = async function (req, res, next) {
    const userIds = await verifyId.findOne(req.body);
    if (!userIds) {
        return next(res.status(400).send('invalid code'));
    };
    next(res.status(200).send('National identity card verify successfully'));

};


exports.verifyPhone = async function (req, res, next) {
    const { phone } = req.body;

    const phoneExist = await phoneVerify.findOne({ phone });

    if (phoneExist) {
        return next(res.status(400).send('phone number already exist, try different phone number'))
    };

    const otp = Math.floor((Math.random() * 1000000) + 1) + "";

    return next(res.status(200).json({
        message: `Your OTP is ${otp}`,
        contactNumber: phone
    }));

};

exports.verifyPhoneOTP = async function (req, res, next) {

    if (!req.body.user) req.body.phoneId = req.params.userId;
    const { otp } = req.body;

    const user = await User.findById(req.body.phoneId);

    if (!user) {
        return next(res.status(400).send('phone number Not found'));
    };
//
//    if (user.phoneOPT !== Otp) {
//        return next(res.status(400).send('incorrect OTP'));
//    };

    next(res.status(200).send('Phone Number verify Successfully'));
};


















