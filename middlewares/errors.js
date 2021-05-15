const winston=require('winston');
module.exports=(error, req, res,next) => {
    winston.error(error.message,error);

    /*  LOGGING LEVELS IN WINSTON(in sequence)
        error,
        warn,
        info,
        verbose,
        debug,
        silly
    */
    res.status(error.status || 500);

    res.json({
        error: {
            message: error.message,
            stack: error.stack
        },
        success:false
    });
}