import dotenv from "dotenv";
import app from "./app.js";
import { db } from "./db/index.js";


dotenv.config();
const PORT = process.env.PORT || 4000;

async function start() {
  try {
    // Test DB connection with a simple query
    await db.execute("SELECT 1");
    console.log("✅ Database connected");

    app.listen(PORT, () => {
      console.log(`🚀 Xtrack backend running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("❌ Failed to start server:", err);
    process.exit(1);
  }
}

start();
