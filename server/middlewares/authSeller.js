import jwt from "jsonwebtoken";

const authSeller = async (req, res, next) =>{
         try {
    
    const sellerToken = req.cookies?.sellerToken || req.header("Authorization")?.replace("Bearer ", "");
     
     console.log(sellerToken, "sellerToken")
     if(!sellerToken){
         return res.json({success: false, message: 'Not Authorized'});
     }
        
        const tokenDecode = jwt.verify(sellerToken, process.env.JWT_SECRET)
       
       console.log(tokenDecode,"decoded token")             
       console.log("email", tokenDecode?.email) 
           
       if(tokenDecode.email === process.env.SELLER_EMAIL){
                 next();
                
       }else{
        return res.json({success: false, message: 'Not Authorized'});
       }
          
      } catch (error) {
       console.log("Auth seller error:", error.message);
       res.json({success: false, message: error.message });
     }
}

export default authSeller;
