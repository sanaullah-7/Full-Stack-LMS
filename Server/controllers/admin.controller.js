import { loginAdmin } from "../services/admin.Service.js";

export const loginAdminController = async(req , res)=>{
    try {
        const {email , password} = req.body;

        // Check fields
        if(!email || !password){
            return res.status(400).json({message : "Email and password are required!"});
        }

        // Login
        const result = await loginAdmin(email, password);
          res.status(200).json({
            message:"Admin login successfully",
            ...result
          })
        
    } 
    catch (error) 
    {
        res.status(401).json({
        message : error.message
        })
    }
}