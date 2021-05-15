const jwt = require('jsonwebtoken');
const config=require('config');
module.exports = (req, res, next) => {
  // const jwtPrivateKey=config.get('jwtPrivateKey');
    try{
        const decoded= jwt.verify(req.headers.token, 'thisismyprivatekey')
        req.userData = decoded;
        next();
    }catch(err){
    res.status(401).json({
      message: 'Auth failed',
      err:err
    });
  }
        
}