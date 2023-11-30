const express = require('express');
const app = express();
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const passport = require('passport');
const expressSession = require('express-session');
const AppError = require('./utils/appError');
const userRouter = require('./routes/userRoutes');
const globalErrorHandler = require('./controllers/errorController');
const paymentController = require('./controllers/paymentController');
const jobsRouter = require('./routes/jobsRoutes');
require('dotenv').config({ path: './config.env' });


app.use(helmet());

if (process.env.NODE_ENV === 'development') {
	app.use(morgan('dev'));
};

const limiter = rateLimit({
	max: 100,
	windowMs: 60 * 60 * 1000,
	message: 'Too many request from this IP, please try again in an hour'
});

app.post('/webhook-checkout', express.raw({ type: 'application/json' }),
   paymentController.webhookCheckout);

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


app.use("/SuperProxy/user", userRouter);
app.use("/SuperProxy/jobs", jobsRouter);
 
app.all('*',  (req, res, next) => {
    next(new AppError(`can't find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

module.exports = app;