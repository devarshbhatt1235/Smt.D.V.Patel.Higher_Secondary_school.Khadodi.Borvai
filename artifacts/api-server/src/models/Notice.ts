import mongoose from "mongoose";

const noticeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  published: { type: Boolean, default: true },
}, { timestamps: true });

export const Notice = mongoose.models["Notice"] ?? mongoose.model("Notice", noticeSchema);
