import mongoose from "mongoose";
import { configDotenv } from "dotenv";
configDotenv();

let connectionPromise;

export const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI environment variable is not configured");
  }

  if (!connectionPromise) {
    connectionPromise = mongoose
      .connect(process.env.MONGODB_URI, {
        serverSelectionTimeoutMS: 10_000,
      })
      .then((db) => {
        console.log(`MongoDB connected: ${db.connection.host}`);
        return db;
      })
      .catch((error) => {
        connectionPromise = undefined;
        console.error("Database connection error:", error.message);
        throw error;
      });
  }

  return connectionPromise;
};




