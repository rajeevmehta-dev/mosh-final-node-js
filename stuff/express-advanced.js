var express=require('express');
var app=express();
const morgan=require('morgan');
const logger=require('./middlewares/logger');
const auth=require('./middlewares/auth');
const config=require('config');

/* We can specify different debuges using different names for different situations,
instead os using console.log.
Switch on a debugger:- export DEBUGGER='<debugger-name>'
Switch off all the debuggers:- export DEBUGGER=''
Switch on all your debuggers: export DEBUGGER=app:*
*/
const start_debug=require('debug')('app:startup');
const env_debug=require('debug')('app:env_debug');

// built in middleware function, first this gets called, then the route function(request processing pipeline)
app.use(express.json());

// another built in middleware function
app.use(express.urlencoded({extended:true}));  // parses the body in JSON(key-value pair into JSON)
//extended true means you can also send array data

app.use(express.static('public'));

/*  using environment to set conditions

 to set NODE_ENV global variable in linux:- export NODE_ENV=production , 
 in windows set NODE_ENV = production , by default, NODE_ENV is set to development.   */
if(app.get('env')==='development')
{
    env_debug('Morgan is Enabled');
    app.use(morgan('tiny'));
}

/* npm install config, to set some variables/settings according to the environment
 we put the settings in config folder   */

 env_debug("Name is : "+config.get('name'));
 env_debug("Mail is : "+config.get('mail.email'));

/* Things like password should be stored securely in environment variables
 e.g. export notes_password=adesh619 , then mention the variable in 
 custom-environment-variables.json file */
 env_debug("Password is : "+config.get('mail.password'));

 /* 

    
 */
app.use(auth);

app.use('/api',function(req,res){
    start_debug(req.body);
    res.send(req.body);    
});

// this gets called after body parsing.
app.use('/',function(req,res){

    res.send('req.body');

}).listen(3000);
start_debug("Node running");