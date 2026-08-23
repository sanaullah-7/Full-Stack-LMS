import jwt from "jsonwebtoken";

export const generateToken = (student)=>{
    const token =jwt.sign( { studentId: student._id,role:"student"},process.env.JWT_SECRET,
        {   
            expiresIn: "1d",
        }
    )
    return token
}