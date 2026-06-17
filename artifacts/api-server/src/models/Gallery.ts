import mongoose from "mongoose";

const gallerySchema = new mongoose.Schema({
  title: { type: String, default: null },
  imageUrl: { type: String, required: true },
  cloudinaryId: { type: String, default: null },
}, { timestamps: true });

export const Gallery = mongoose.models["Gallery"] ?? mongoose.model("Gallery", gallerySchema);
