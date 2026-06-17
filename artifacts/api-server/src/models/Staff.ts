import mongoose from "mongoose";

const staffSchema = new mongoose.Schema({
  name: { type: String, required: true },
  designation: { type: String, default: null },
  qualification: { type: String, default: null },
  subjectsTaught: { type: [String], default: [] },
  employeeNumber: { type: String, default: null },
  joiningDate: { type: String, default: null },
  photoUrl: { type: String, default: null },
}, { timestamps: true });

export const Staff = mongoose.models["Staff"] ?? mongoose.model("Staff", staffSchema);
