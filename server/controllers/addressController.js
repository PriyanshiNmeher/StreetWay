import Address from "../models/Address.js"

// Add Address : /api/address/add
export const addAddress = async(req, res)=>{
   try {
    const { address } = req.body;
    const userId = req.userId;
    
    console.log("userId from req:", userId); // Debug के लिए
    console.log("address data:", address); // Debug के लिए
    
    // ✅ userId validation add करें
    if (!userId) {
        return res.json({success: false, message: "User not authenticated"});
    }
    
    if (!address) {
        return res.json({success: false, message: "Address data is required"});
    }
    
    const newAddress = await Address.create({
        ...address, 
        userId
    });
    
    console.log("Created address:", newAddress); // Debug के लिए
        
    res.json({success: true, message: "Address added successfully", address: newAddress})
   } catch (error) {
    console.log("Add address error:", error.message);
    res.json({ success: false, message: error.message});
   }
}

// Get Address: /api/address/get
export const getAddress = async(req, res)=>{
try {
    const userId = req.userId;
    
    console.log("Get address userId:", userId);
    
    if (!userId) {
        return res.json({success: false, message: "User not authenticated"});
    }
    
    const addresses = await Address.find({userId});
    
    console.log("Found addresses:", addresses); 
    
    res.json({success: true, addresses})
 } catch (error) {
    console.log("Get address error:", error.message);
    res.json({ success: false, message: error.message}); 
}
}
