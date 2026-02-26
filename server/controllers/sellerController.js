

// import jwt from 'jsonwebtoken'

// //Login Seller : /api/seller/login
// export const sellerLogin = async (req, res) =>{
//     try {
//         const { email, password } = req.body;
        
//         if(password == process.env.SELLER_PASSWORD && email === process.env.SELLER_EMAIL ){
//             const token = jwt.sign({email}, process.env.JWT_SECRET, {expiresIn: '7d'});
            
//             console.log("Generated sellerToken:", token);
            
//             res.cookie('sellerToken', token, {
//                 httpOnly: true, 
//                 secure: process.env.NODE_ENV === 'production',   
//                 sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
//                 maxAge: 7 * 24 * 60 * 60 * 1000,
//             });
            
           
//             return res.json({ success: true, message: "Logged In", sellerToken: token });
//         }else{
//             return res.json({ success: false, message: "Invalid Credentials" });
//         }
//     } catch (error) {
//         console.log("Seller login error:", error.message);
//         res.json({ success: false, message: error.message})
//     }
// }

// // Seller isAuth: /api/seller/is-auth
// export const isSellerAuth = async (req, res)=>{
//     try{
       
//         const sellerToken = req.cookies?.sellerToken || req.header("Authorization")?.replace("Bearer ", "");
        
//         console.log("Checking sellerToken:", sellerToken);
        
//         if(!sellerToken){
//             return res.json({success: false, message: 'Not Authorized'});
//         }
        
//         const tokenDecode = jwt.verify(sellerToken, process.env.JWT_SECRET);
        
//         if(tokenDecode.email === process.env.SELLER_EMAIL){
//             return res.json({success: true, seller: { email: tokenDecode.email }});
//         }else{
//             return res.json({success: false, message: 'Not Authorized'});
//         }
        
//     } catch (error) {
//         console.log("Seller auth error:", error.message);
//         res.json({success: false, message: error.message })
//     }
// }

// //Logout Seller : /api/seller/logout
// export const sellerLogout = async (req, res)=>{
//     try {
//         res.clearCookie('sellerToken', {
//             httpOnly: true,
//             secure: process.env.NODE_ENV === 'production',
//             sameSite: process.env.NODE_ENV === 'production' ? 'none': 'strict',
//         });
        
//         return res.json({success: true, message: "Logged Out" })
//     } catch (error) {
//         console.log("Seller logout error:", error.message);
//         res.json({success: false, message: error.message })
//     }
// }


import jwt from 'jsonwebtoken'
import Seller from '../models/Seller.js'
import bcrypt from 'bcryptjs'

// Register Seller : /api/seller/register
export const sellerRegister = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.json({ success: false, message: 'Missing Details' })
        }

        const existingSeller = await Seller.findOne({ email })
        if (existingSeller) {
            return res.json({ success: false, message: 'Seller already exists' })
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        const seller = await Seller.create({ name, email, password: hashedPassword })

        const token = jwt.sign({ id: seller._id }, process.env.JWT_SECRET, { expiresIn: '7d' })

        res.cookie('sellerToken', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        })

        return res.json({ 
            success: true, 
            message: 'Seller registered successfully',
            sellerToken: token,
            seller: { name: seller.name, email: seller.email }
        })

    } catch (error) {
        console.log(error.message)
        res.json({ success: false, message: error.message })
    }
}

// Login Seller : /api/seller/login
export const sellerLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.json({ success: false, message: 'Email and password are required' })
        }

        const seller = await Seller.findOne({ email })
        if (!seller) {
            return res.json({ success: false, message: 'Invalid email or password' })
        }

        const isMatch = await bcrypt.compare(password, seller.password)
        if (!isMatch) {
            return res.json({ success: false, message: 'Invalid email or password' })
        }

        const token = jwt.sign({ id: seller._id }, process.env.JWT_SECRET, { expiresIn: '7d' })

        res.cookie('sellerToken', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        })

        return res.json({ 
            success: true, 
            message: 'Logged In',
            sellerToken: token,
            seller: { name: seller.name, email: seller.email }
        })

    } catch (error) {
        console.log(error.message)
        res.json({ success: false, message: error.message })
    }
}

// Seller isAuth : /api/seller/is-auth
export const isSellerAuth = async (req, res) => {
    try {
        const seller = await Seller.findById(req.sellerId).select("-password")
        if (!seller) {
            return res.json({ success: false, message: 'Not Authorized' })
        }
        return res.json({ success: true, seller })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

// Logout Seller : /api/seller/logout
export const sellerLogout = async (req, res) => {
    try {
        res.clearCookie('sellerToken', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        })
        return res.json({ success: true, message: "Logged Out" })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}