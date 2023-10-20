const express = require('express');
const app = express();
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const passport = require('passport');
const expressSession = require('express-session');
const userRouter = require('./routes/userRoutes');
const findJobsRouter = require('./routes/findJobsRoutes');
require('dotenv').config({ path: './config.env' });


//app.use(helmet());

if (process.env.NODE_ENV) {
	app.use(morgan('dev'));
};

const limiter = rateLimit({
	max: 100,
	windowMs: 60 * 60 * 1000,
	message: 'Too many request from this IP, please try again in an hour'
});


app.use(expressSession({
	secret: process.env.EXPRESS_SECRET,
	resave: false,
	saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());


app.use('/SuperProxy', limiter);


app.use(express.json());
app.set('view engine', 'ejs');


app.use(async function (err, req, res, next) {
	console.error(err.stack);
});


app.use("/SuperProxy/user", userRouter);
app.use("/SuperProxy", findJobsRouter);



module.exports = app;