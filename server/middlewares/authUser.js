import jwt from 'jsonwebtoken';
import User from "../models/User.js";

 

const authUser = async (req, res, next)=>{
  try {
    const token = req.cookies?.token || req.header("Authorization")?.replace("Bearer ", "");

    if(!token){
        return res.json({success: false, message: 'Not Authorized'});
    }

       const tokenDecode = jwt.verify(token, process.env.JWT_SECRET)
       req.data = {userId: tokenDecode.id}
      
       const user = await User.findById(tokenDecode?.id).select("-password -refreshToken")
      
       if(tokenDecode.id){
        req.userId = tokenDecode.id;
        
       }else{
        return res.json({success: false, message: 'Not Authorized'});
       }
       req.user = user;
      //  req.userId = user._id;
       next();
       
     } catch (error) {
       res.json({success: false, message: error.message });
     }
}

export default authUser;