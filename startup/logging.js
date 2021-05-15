const winston = require('winston');
require('winston-mongodb');

module.exports = function () {

    // Handle Promise Rejections
    process.on('unhandledRejection', (ex) => {
        throw ex;  //we are throwing the error so that the winston.handleException will handle it.
    });

    winston.handleExceptions(
        /* This method will automatically catch and log all the uncaught exceptions,
         but by default will not catch unhandled Promises   */
         new winston.transports.Console({colorize:true,prettyPrint:true}),
        new winston.transports.File({ filename: 'uncaughtExceptions.log' })
    );

    winston.add(winston.transports.File, { filename: 'logfile.log' });
    winston.add(winston.transports.MongoDB, { db: 'mongodb://localhost/Mosh' });
}