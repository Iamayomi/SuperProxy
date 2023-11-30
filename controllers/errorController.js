const AppError = require('../utils/appError');

const handleCastErrorDB = err => {
    const message = `Invalid ${err.path}: ${err.value}`;
    return new AppError(message, 400);
};

const handleDuplicateFieldsDB = err => {
    const value = JSON.stringify(err.keyValue).match(/(["'])(\\?.)*?\1/)[0];
    const message = `Duplicate field: ${value}. Please use another value!`;
    return new AppError(message, 400);
};

const handleValidationErrorDB = err => {
    const errors = Object.values(err.errors).map(el => el.message);
    const message = `Invalid input data: ${errors.join(". ")}`
    return new AppError(message, 400);
};

const handleJWTError = err => new AppError('Invalid token. please log in again', 401);

const handleJWTExpiredError = err => new AppError('Your token has expired!. please log in again', 401);

const errorDev = (err, res) => {
    res.status(err.statusCode).json({
     status: err.status,
     error: err,
     message: err.message,
     stack: err.stack
   });
};

const errorProd = (err, res) => {
    
  if(err.isOperational) {
    res.status(err.statusCode).json({
     status: err.status,
     message: err.message
   });
      
  } else {
      console.error('ERROR', err);
      
      res.status(500).json({
          status: 'error',
          message: 'something went wrong'
      })
  }
};


module.exports = function (err, req, res, next) {
   err.statusCode = err.statusCode || 500;
   err.status = err.status || 'error';
    
       
   if(process.env.NODE_ENV === 'development'){
      errorDev(err, res);
   } else if (process.env.NODE_ENV === 'production'){
       let error = { ...err};
       
       if(error.code === 11000) error = handleDuplicateFieldsDB(error);
       
       if(error.name === 'CastError') error = handleCastErrorDB(error);
       
       if(error.name === 'JsonWebTokenError') error = handleJWTError();
       
       if(error.name === 'TokenExpiredError') error = handleJWTExpiredError();
       
       if(error.name === 'ValidatorError') error = handleValidationErrorDB(error); 
        
      errorProd(error, res);
     }
};


