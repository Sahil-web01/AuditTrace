import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import { connectDB } from "./config/db.js";
import { ensureDemoUsers } from "./controllers/authController.js";

const PORT = process.env.PORT || 5000;

connectDB().then(async () => {
  await ensureDemoUsers();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
