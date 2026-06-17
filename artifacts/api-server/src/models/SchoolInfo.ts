import mongoose from "mongoose";

const schoolInfoSchema = new mongoose.Schema({
  nameGujarati: { type: String, default: "શ્રીમતી ડી વી પટેલ ઉ.મા.શાળા ખડોદી બોરવાઈ" },
  nameEnglish: { type: String, default: "Shrimati DV Patel Upper Secondary School Khadodi Borwai" },
  trustName: { type: String, default: "શ્રી ખડોદી બોરવાઈ ગ્રુપ કેળવણી મંડળ" },
  address: { type: String, default: "મુકામ પોસ્ટ બોરવાઈ, તાલુકો ખાનપુર, જિલ્લો મહીસાગર, પિન ૩૮૯૨૩૨" },
  established: { type: Number, default: 1972 },
  principalName: { type: String, default: null },
  principalMessage: { type: String, default: null },
  presidentName: { type: String, default: null },
  secretaryName: { type: String, default: null },
  facilities: { type: [String], default: [] },
  logoUrl: { type: String, default: null },
}, { timestamps: true });

export const SchoolInfo = mongoose.models["SchoolInfo"] ?? mongoose.model("SchoolInfo", schoolInfoSchema);
