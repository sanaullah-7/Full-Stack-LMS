import jwt from "jsonwebtoken";
import Admin from "../models/admin.Model.js";
    // "Protect" (Authorization) means "What are you allowed to do?
    export const protectAdmin = async(req , res, next)=>{//req=> Client se jo request aayi hai. res=>Backend client ko jo jawab dega. 
        try {
            // reuqest to Authorization header lo
            const authHeader = req.headers.authorization;
            // console.log(authHeader)
            // check karo k token deya gya ha ya nhi
            if (!authHeader){
                // return mean response bhejne ke baad function ko yahin stop kar do.
                return res.status(401).json({
                    message: "Authentication token is required!",
                });
            }
            // Bearer ke baad actual JWT token nikalo
            const token = authHeader.split(" ")[1];//[1]:ka matlab second item  and split(" ") Space par string ko tod do:
            // console.log(token)
            if(!token){
                return res.status(401).json({
                    message: "invalid authorization format"
                })
            }

            // JWT verify karo
            const decoded = jwt.verify( //Check karo ke JWT asli hai, modify nahi hua, aur expired nahi hua.
                token,
                process.env.JWT_SECRET
            );
             // 5. Admin database se find karo
              const admin = await Admin.findById(decoded.adminId);
          
              if (!admin) {
                return res.status(401).json({
                  message: "Admin not found",
                });
              }

            // console.log(decoded)
            // Check  karo user Admin ha ya nhi 
            if (decoded.role !== "admin")//ye middleware authentication + authorization dono ka small part kar raha hai:
                {
                return res.status(403).json({
                    message:"Access denied. Admin Only"
                })
            }

             // 7. Token version check karo
    if (decoded.tokenVersion !== admin.tokenVersion) {
      return res.status(401).json({
        message: "Token is no longer valid. Please login again",
      });
    }

             // 8. Verified Admin ko request mein save karo
    req.admin = {
      id: admin._id,
      name: admin.name,
      email: admin.email,
      role: "admin",
    };

            //ab next controller/route ko jane do
            next();
            
        } 
        catch (error)
        {
            return res.status(401).json({
                message: "Invalid or expired token"
            })
            
        }
    } 