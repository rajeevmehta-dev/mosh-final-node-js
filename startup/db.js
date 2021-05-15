const mongoose = require('mongoose');
const winston=require('winston');
const config=require('config');
module.exports = function () {
    //connect to DB
    // let db=config.get('dbPath');
    let db='mongodb://localhost/Mosh';
    mongoose.connect(db, { useMongoClient:true })
        .then((connected) => {
            winston.info("DB Connected: "+db);
            
        });
}
