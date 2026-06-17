import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  grNumber: { type: String, required: true, unique: true },
  class: { type: String, required: true },
  gender: { type: String, default: null },
  fatherName: { type: String, default: null },
  address: { type: String, default: null },
  photoUrl: { type: String, default: null },
}, { timestamps: true });

export const Student = mongoose.models["Student"] ?? mongoose.model("Student", studentSchema);
