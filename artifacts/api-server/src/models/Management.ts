import mongoose from "mongoose";

const managementSchema = new mongoose.Schema({
  name: { type: String, required: true },
  designation: { type: String, required: true },
  photoUrl: { type: String, default: null },
  order: { type: Number, default: 0 },
}, { timestamps: true });

export const Management = mongoose.models["Management"] ?? mongoose.model("Management", managementSchema);
