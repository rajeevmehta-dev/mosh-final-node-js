var server;
const request = require('supertest');
const dbConnect=require('../../../startup/db');


describe('Connect to Database',()=>{

    it('It should connect to database',()=>{
      dbConnect();
      
    });
});