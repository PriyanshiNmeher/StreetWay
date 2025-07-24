import jwt from "jsonwebtoken";

const authSeller = async (req, res, next) =>{
    
    try {
    const sellerToken = req.cookies.sellerToken;
    
console.log(sellerToken, "sellerToken")
    if(!sellerToken){
        return res.json({success: false, message: 'Not Authorized'});
    }

       const tokenDecode = jwt.verify(sellerToken, process.env.JWT_SECRET)
       console.log(tokenDecode,"decoded token")             
console.log("id", tokenDecode?.id)
   
       if(tokenDecode.email === process.env.SELLER_EMAIL){
        
        next();
        
       }else{
        return res.json({success: false, message: 'Not Authorized'});
       }
    
     } catch (error) {
       res.json({success: false, message: error.message });
     }
}

export default authSeller; 