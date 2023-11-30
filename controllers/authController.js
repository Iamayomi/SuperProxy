const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const verifyId = require('../models/verifyIdModel');
const errorAsync = require('../utils/errorAsync');
const AppError = require('../utils/appError');
const { promisify } = require('util');
const bcrypt = require('bcryptjs');
const Email = require('../utils/email');


const signToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
};

const cookiesOptions = {
    expires: new Date(Date.now() + process.env.JWT_COOKIEs_EXPIRES * 24 * 60 * 60 * 1000),
    httpOnly: true,
    sameSite: 'lax'
};

if (process.env.NODE_ENV === 'production') cookiesOptions.secure = true;

exports.signup = errorAsync(async function (req, res, next) {
    const newUser = await User.create({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        gender: req.body.gender,
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
});


exports.signin = errorAsync(async function (req, res, next) {
    const { email, password } = req.body;

    if (!email || !password) return next(res.status(201).send("please provide an email and password"));

    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.comparePassword(password, user.password))) {
        return next(new AppError('incorrect email or password', 400));
    };

    const token = signToken(user._id);

    res.cookie('jwt', cookiesOptions);

    res.status(200).json({
        status: 'success',
        token
    })
});


exports.protect = errorAsync(async function (req, res, next) {
    let token;

    if (req.headers.authorization?.startsWith('Bearer'))
        token = req.headers.authorization.split(' ')[1];

    if (!token) {
        return next(new AppError('You are not logged in, Please log in to get access', 401))
    };

    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    const currentUser = await User.findById(decoded.id);

    if (!currentUser) {
        return next(new AppError('This user token does not longer exist ', 401))
    };

    if (currentUser.checkPasswordChangedAt(decoded.iat)) {
        return next(new AppError('User recently changed password! please log in again.', 401))

    };

    req.user = currentUser;
    next();
});



exports.changePassword = errorAsync(async function (req, res, next) {

    const user = await User.findById(req.user.id).select('+password');

    const { currentPassword, password, confirmPassword } = req.body;

    if (!await bcrypt.compare(currentPassword, user.password)) {
        return next(new AppError('Your current password is wrong', 401))
    };

    user.password = password;
    user.confirmPassword = confirmPassword;
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

    next();
});


exports.restrict = function (...role) {
    return function (req, res, next) {
        if (!role.includes(req.user.role)) {
            return next(new AppError('You are not given permission to perform this action', 403))
        };
        next();
    };
};


exports.verifyId = errorAsync(async function (req, res, next) {

    const { code } = req.body;

    const userIds = await verifyId.findOne({ code });

    if (!userIds) {
        return next(new AppError('invalid code', 400))
    };

    next(res.status(200).send('National identity card verify successfully'));

});


exports.verifyPhone = errorAsync(async function (req, res, next) {
    const { phone } = req.body;

    const phoneExist = await User.findOne({ phone });

    //    console.log(req.user.phone)

    if (phoneExist) {
        return next(new AppError('phone number already exist, try different phone number', 400))
    };

    const otp = Math.floor((Math.random() * 1000000) + 1) + "";

    req.user.phoneOTP = otp;
    req.user.createPhoneExpires();
    req.user.save({ validateBeforeSave: false })

    return next(res.status(200).json({
        message: `Your OTP is ${otp}`,
        contactNumber: phone
    }));

});

exports.verifyPhoneOTP = errorAsync(async function (req, res, next) {

    const { otp } = req.body;
    
    const user = await User.findOne({ phoneOTP: otp, phoneNumberExpire: { $gt: Date.now() } });
    
    console.log(user);
    
    if (!user) {
        return next(new AppError('invalid phonenumber or otp or otpExpires', 400))
    };

    user.phoneOTP = undefined;
    user.phoneNumberExpire = undefined;

    next(res.status(200).send('Phone Number verify Successfully'));
});


exports.forgotPassword = errorAsync(async function (req, res, next) {
    const user = await User.findOne({ email: req.body.email });

    console.log(user);
    if (!user) {
        return next(new AppError('There us no user with this email address', 404))
    };

    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });
    
    const resetUrl = `${req.protocol}://${req.get('host')}/SuperProxy/resetPassword/${resetToken}`;
    console.log(resetUrl);
//    const message = `we recieved a request to reset password for SuperProxy account associated with ${req.user.email}. if you didn't make this request, No changes have been made to your account`;
    
    await new Email(user, resetUrl).sendPasswordReset();
    next();
});


exports.resetPassword = errorAsync(async function (req, res, next) {
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    const user = await User.findOne({ passwordResetToken: hashedToken, passwordResetExpires: { $gt: Date.now() } })

    if (!user) {
        return next(new AppError('Token is invalid or Expires', 400))
    }

    user.password = req.body.password;
    user.confirmPassword = req.body.connfirmPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
    
    
     const token = signToken(user._id);

    res.cookie('jwt', cookiesOptions);

    res.status(200).json({
        status: 'success',
        token
    })
});












