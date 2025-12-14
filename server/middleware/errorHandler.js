/**
 * Global Error Handling Middleware
 * Catches all errors and sends appropriate responses
 */

// Custom error class for API errors
class ApiError extends Error {
    constructor(message, statusCode){
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor)
    }
}

// Not found error handler
const notFound = (req, res, next) => {
    const error = new ApiError(`routes ${req.originalUrl} not foumd`, 404);
    next(error);
};

//Global error handler 
const errorHandler = (err, req, res, next) => {
    //default values 
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';
    err.message = err.message || 'Internal Server Error';
    
    // log error in development 
    if (process.env.NODE_ENV === 'development') {
        console.error('❌ Error:', {
            message: err.message,
            stack: err.stack,
            path:req.path,
            method: req.method,
            timestamp: new Date().toISOString()
        });
    }
    //MongoDB duplicate key error
    if (err.code === 11000) {
        const error = Object.values(err.error).map(el => el.message);
        err.message = `Invalid input: ${error.json('. ')}`;
        error.statusCode = 400;
    }
    //MongoDB vvalidation error
    if (err.name === 'ValidationError') {
        const error = Object.values(err.error).map(el => el.message);
        err.message = `Invalid input: ${error.json('. ')}`;
        err.statusCode = 400;
    }

    //JWT error
    if (err.name === 'JsonWebTokenError') {
        err.message = 'Invalid token. please log in again.';
        err.statusCode = 401;
    }

    if (err.name === 'TokenexpiredError') {
        err.message = 'Your taken has expired. please log in again.';
        err.statusCode = 401;
    }

    // Send error response
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
};

module.exports = { errorHandler, notFound, ApiError };