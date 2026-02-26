

import jwt from "jsonwebtoken";
import Seller from "../models/Seller.js";

const authSeller = async (req, res, next) => {
    try {
        const sellerToken = req.cookies?.sellerToken || 
            req.header("seller-token")?.replace("Bearer ", "");

        if (!sellerToken) {
            return res.json({ success: false, message: 'Not Authorized' });
        }

        const tokenDecode = jwt.verify(sellerToken, process.env.JWT_SECRET)
        
        if (!tokenDecode.id) {
            return res.json({ success: false, message: 'Not Authorized' });
        }

        req.sellerId = tokenDecode.id;
        next();

    } catch (error) {
        console.log("Auth seller error:", error.message);
        res.json({ success: false, message: error.message });
    }
}

export default authSeller;
