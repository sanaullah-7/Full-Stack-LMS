import Admin from "../models/admin.Model.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

export const loginAdmin = async (email , password)=>{
     // Find admin
    const admin = await Admin.findOne({email});
    // console.log("EMAIL:", email);
    // console.log("ADMIN:", admin);
    if(!admin){
        throw new Error("Invalid email or password")
    }
    // Check password
    const isPasswordCorrect =  await bcrypt.compare(password, admin.password);
    if (!isPasswordCorrect){
        throw new Error("Invalid email or password")
    }
    // Create token 
    const token = jwt.sign( //=>JWT token create/generate karo.
        {adminId:admin._id, role: "admin",tokenVersion: admin.tokenVersion,}, process.env.JWT_SECRET,
        {expiresIn: "1d" }
    );

    return{
        token,
        admin:{
            id:admin._id,
            name:admin.name,
            email:admin.email,
            role:"admin",
        },
    };

};