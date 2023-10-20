const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const User = require('../models/userModel');
require('dotenv').config({ path: './config.env' });


passport.use(
    new FacebookStrategy(
        {
            clientID: process.env.FACEBOOK_APP_ID,
            clientSecret: process.env.FACEBOOK_APP_SECRET,
            callbackURL: process.env.FACEBOOK_CALLBACK_URL
        },
        async function (accessToken, refreshToken, profile, cb) {
            const user = await User.findOne({
                facebookId: profile.id,
                provider: 'facebook'
            });
            if (!user) {
                console.log('Adding new facebokk user to DB.....');
                const user = new User({
                    facebookId: profile.id,
                    name: profile.displayName,
                    provider: profile.provider
                });

                await user.save();
                console.log(user);
                return cb(null, profile);
            } else {
                console.log('Facebook user is already exist in DB...');
                console.log(profile);
                return cb(null, profile);
            }
        }
    )
);


exports.facebookSignup = passport.authenticate('facebook', { scope: 'email' });

exports.callback = passport.authenticate('facebook', {
    failureRedirect: '/auth/facebook/error'
}),
    function (req, res) {
        res.redirect('/auth/facebook/success')
    };


exports.success = function (req, res) {
    const userInfo = {
        id: req.session.passport.user.id,
        displayName: req.session.passport.user.displayName,
        provider: req.session.passport.user.provider
    };
    res.status(200).json({ user: userInfo });
    next();
};

exports.error = (req, res) => {
    res.send('Error logging in via facebook');
};









