import mongoose from "mongoose";

const topStudentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  fatherName: { type: String, default: null },
  class: { type: String, required: true },
  rank: { type: Number, required: true },
  percentage: { type: Number, default: null },
  year: { type: String, required: true },
  photoUrl: { type: String, default: null },
}, { timestamps: true });

export const TopStudent = mongoose.models["TopStudent"] ?? mongoose.model("TopStudent", topStudentSchema);
