import jwt from 'jsonwebtoken';
import User from "../models/User.js";

 

const authUser = async (req, res, next)=>{
  try {
    const token = req.cookies?.token || req.header("Authorization")?.replace("Bearer ", "");
console.log(token, "token")
    if(!token){
        return res.json({success: false, message: 'Not Authorized'});
    }

       const tokenDecode = jwt.verify(token, process.env.JWT_SECRET)
       req.data = {userId: tokenDecode.id}
       console.log(tokenDecode,"decoded token")             
console.log("id", tokenDecode?.id)
       const user = await User.findById(tokenDecode?.id).select("-password -refreshToken")
       console.log(user, "user")
       if(tokenDecode.id){
        req.userId = tokenDecode.id;
        
       }else{
        return res.json({success: false, message: 'Not Authorized'});
       }
       req.user = user;
       next();
       
     } catch (error) {
       res.json({success: false, message: error.message });
     }
}

export default authUser;