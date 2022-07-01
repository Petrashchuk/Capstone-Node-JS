const statusCode = require('http-status-codes');

function errorHandler(err, req, res, next) {
    err.statusCode = err.statusCode || statusCode.INTERNAL_SERVER_ERROR;
    err.status = err.status || 'error';

    res.status(err.statusCode).json({
        status: err.status,
        message: err.message
    });
}

module.exports = errorHandler