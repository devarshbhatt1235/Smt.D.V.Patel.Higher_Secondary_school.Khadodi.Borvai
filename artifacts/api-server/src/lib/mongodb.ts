import mongoose from "mongoose";
import { logger } from "./logger";

let connected = false;

export async function connectMongo() {
  if (connected) return;
  const uri = process.env["MONGODB_URI"];
  if (!uri) throw new Error("MONGODB_URI environment variable is required");
  await mongoose.connect(uri, { dbName: "dvpatel_school" });
  connected = true;
  logger.info("Connected to MongoDB");
}

export default mongoose;
