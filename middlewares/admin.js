const jwt=require('jsonwebtoken');

module.exports=(req,res,next)=>{
    // const jwtPrivateKey=config.get('jwtPrivateKey');
    try{
        const decoded=jwt.verify(req.headers.token,'thisismyprivatekey');
        if(!decoded.isAdmin) return res.status(403).send({message:"Forbidden !"})
        req.userData=decoded;
        next();
    }
    catch(e){
        return res.status(403).send({message:e.message});
    }
    

}