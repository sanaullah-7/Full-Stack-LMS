import "dotenv/config";
import app from "./app.js";
import { connectDB } from "./config/db.js";

const PORT = process.env.PORT || 9000;

connectDB()
  .then(() => {
    const server = app.listen(PORT, () => {
      console.log(`Server Running on PORT http://localhost:${PORT}`);
    });

    // Port already in use → clear message (no cryptic crash stack)
    server.on("error", (error) => {
      if (error.code === "EADDRINUSE") {
        console.error(
          `\n[ERROR] Port ${PORT} already in use.\n` +
            `Matlab: pehle se ek server chal raha hai.\n\n` +
            `Fix (PowerShell):\n` +
            `  1) netstat -ano | findstr :${PORT}\n` +
            `  2) taskkill /PID <PID> /F\n` +
            `  3) npm start\n\n` +
            `Ya purana terminal band karke dubara npm start chalao.\n`,
        );
        process.exit(1);
      }
      console.error("Server failed to start:", error);
      process.exit(1);
    });
  })
  .catch((error) => {
    console.error("Database connection failed:", error);
    process.exit(1);
  });
