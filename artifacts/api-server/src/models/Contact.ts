import mongoose from "mongoose";

const contactSchema = new mongoose.Schema({
  phone: { type: String, default: null },
  email: { type: String, default: "dvpatelhighschool@gmail.com" },
  mapLink: { type: String, default: null },
  facebookUrl: { type: String, default: null },
  whatsappNumber: { type: String, default: null },
  youtubeUrl: { type: String, default: null },
}, { timestamps: true });

export const Contact = mongoose.models["Contact"] ?? mongoose.model("Contact", contactSchema);
