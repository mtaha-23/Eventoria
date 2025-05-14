// Error handling middleware
const errorHandler = (err, req, res, next) => {
    console.error('Error:', err);

    // Default error status and message
    let status = err.status || 500;
    let message = err.message || 'Internal Server Error';

    // Handle specific error types
    if (err.name === 'ValidationError') {
        status = 400;
        message = Object.values(err.errors).map(val => val.message).join(', ');
    }

    if (err.name === 'CastError') {
        status = 400;
        message = 'Invalid ID format';
    }

    if (err.code === 11000) {
        status = 400;
        message = 'Duplicate field value entered';
    }

    // Handle JWT errors
    if (err.name === 'JsonWebTokenError') {
        status = 401;
        message = 'Invalid token';
    }

    if (err.name === 'TokenExpiredError') {
        status = 401;
        message = 'Token expired';
    }

    // Send error response
    if (req.xhr || req.headers.accept.includes('application/json')) {
        // API error response
        res.status(status).json({
            success: false,
            message,
            error: process.env.NODE_ENV === 'development' ? err : {}
        });
    } else {
        // Render error page
        res.status(status).render('error', {
            message,
            error: process.env.NODE_ENV === 'development' ? err : {}
        });
    }
};

// 404 handler
const notFound = (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    error.status = 404;
    next(error);
};

module.exports = {
    errorHandler,
    notFound
}; 