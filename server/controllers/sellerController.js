

import jwt from 'jsonwebtoken'

//Login Seller : /api/seller/login
export const sellerLogin = async (req, res) =>{
    try {
        const { email, password } = req.body;
        
        if(password == process.env.SELLER_PASSWORD && email === process.env.SELLER_EMAIL ){
            const token = jwt.sign({email}, process.env.JWT_SECRET, {expiresIn: '7d'});
            
            console.log("Generated sellerToken:", token);
            
            res.cookie('sellerToken', token, {
                httpOnly: true, 
                secure: process.env.NODE_ENV === 'production',   
                sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });
            
           
            return res.json({ success: true, message: "Logged In", sellerToken: token });
        }else{
            return res.json({ success: false, message: "Invalid Credentials" });
        }
    } catch (error) {
        console.log("Seller login error:", error.message);
        res.json({ success: false, message: error.message})
    }
}

// Seller isAuth: /api/seller/is-auth
export const isSellerAuth = async (req, res)=>{
    try{
       
        const sellerToken = req.cookies?.sellerToken || req.header("Authorization")?.replace("Bearer ", "");
        
        console.log("Checking sellerToken:", sellerToken);
        
        if(!sellerToken){
            return res.json({success: false, message: 'Not Authorized'});
        }
        
        const tokenDecode = jwt.verify(sellerToken, process.env.JWT_SECRET);
        
        if(tokenDecode.email === process.env.SELLER_EMAIL){
            return res.json({success: true, seller: { email: tokenDecode.email }});
        }else{
            return res.json({success: false, message: 'Not Authorized'});
        }
        
    } catch (error) {
        console.log("Seller auth error:", error.message);
        res.json({success: false, message: error.message })
    }
}

//Logout Seller : /api/seller/logout
export const sellerLogout = async (req, res)=>{
    try {
        res.clearCookie('sellerToken', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none': 'strict',
        });
        
        return res.json({success: true, message: "Logged Out" })
    } catch (error) {
        console.log("Seller logout error:", error.message);
        res.json({success: false, message: error.message })
    }
}
