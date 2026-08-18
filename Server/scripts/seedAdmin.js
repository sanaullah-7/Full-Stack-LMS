import bcrypt from "bcrypt"
import Admin from "../models/admin.Model.js";
import { connectDB } from "../config/db.js";


// Seed = database ko starting/initial may kuch required data automatically insert karna..
const seedAdmin = async () => {
  try {

    await connectDB();
    // convert pass into bcrypted(hashed)
    const password = await bcrypt.hash(process.env.ADMIN_PASSWORD,10);
    // check if amdin exsiting 
       const existingAdmin = await Admin.findOne({email:process.env.ADMIN_EMAIL ,});
          if (existingAdmin) {
           console.log("Admin already exists");
            process.exit();
              }
              
    // create admin
     await Admin.create({
      name: "Super admin",
      email: process.env.ADMIN_EMAIL,
      password,
    });

    console.log("Admin created successfully");

    process.exit();

  } catch (error) {

    console.log(error.message);

    process.exit(1);

  }
};

seedAdmin();