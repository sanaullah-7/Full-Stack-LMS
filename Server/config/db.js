import dns from "node:dns";
dns.setServers(["8.8.8.8", "8.8.4.4"]);   // DNS fix — wapas add kiya

import mongoose from "mongoose";
import { configDotenv } from "dotenv";
configDotenv();

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);   // ✅ await add kiya
    console.log(`MongoDB connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`DB Error: ${error.message}`);
    throw error;   // ✅ error ko upar (server.js) tak pohanchne do
  }
};