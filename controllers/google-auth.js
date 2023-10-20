const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/userGoModel');
require('dotenv').config({ path: './config.env' });


passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.GOOGLE_CALLBACK_URL
        },
        async function (accessToken, refreshToken, profile, cb) {
            const user = await User.findOne({
                googleId: profile.id,
                provider: 'google'
            });
            if (!user) {
                console.log('Adding new google user to DB.....');
                const user = new User({
                    method: 'google',
                    Id: profile.id,
                    name: profile.displayName,
                    provider: profile.provider,
                    email: profile.emails[0].value
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


exports.isLoggedIn = async function (req, res, next) {
    if (req.user) {
        next();
    } else {
        res.sendStatus(401);
    }
};

exports.failed = (req, res) => {
    res.send('failed');
};

exports.google = passport.authenticate('google', { scope: ['email', 'profile'], accesType: 'online', session: false });

exports.callback = passport.authenticate('google', { failureRedirect: '/failed ' }), function (req, res) {
    res.redirect('/success')
}


exports.success = function (req, res) {
    res.send(`Welcome ${req.user.email}`);
};











