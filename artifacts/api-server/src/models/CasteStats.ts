import mongoose from "mongoose";

const casteStatsSchema = new mongoose.Schema({
  stBoys: { type: Number, default: 0 },
  stGirls: { type: Number, default: 0 },
  obcBoys: { type: Number, default: 0 },
  obcGirls: { type: Number, default: 0 },
  scBoys: { type: Number, default: 0 },
  scGirls: { type: Number, default: 0 },
  generalBoys: { type: Number, default: 0 },
  generalGirls: { type: Number, default: 0 },
}, { timestamps: true });

export const CasteStats = mongoose.models["CasteStats"] ?? mongoose.model("CasteStats", casteStatsSchema);
