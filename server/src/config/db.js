import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/audittrace");
    const hostDisplay = conn.connection.host.includes("mongodb.net")
      ? "MongoDB Atlas (Cluster0)"
      : conn.connection.host;
    console.log(`MongoDB connected: ${hostDisplay}`);
  } catch (err) {
    console.error(`MongoDB connection error: ${err.message}`);
    process.exit(1);
  }
};
