// const User=require('../../../models/users');
// const auth=require('../../../middlewares/auth');

// describe('auth middleware',()=>{

//     it('should populate req.user with the payload',()=>{

//         const token=new User().createJWT();
//         const req={
//             header:jest.fn().mockReturnValue({token:token})
//         };

//         const res={};
//         const next=jest.fn();
//         auth(req,res,next);
//         expect (req.user).toBeDefined();
//     });
// })