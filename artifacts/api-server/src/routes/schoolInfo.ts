import { Router } from "express";
import { SchoolInfo } from "../models/SchoolInfo";
import { requireAuth } from "../middlewares/auth";
import { logger } from "../lib/logger";

const router = Router();

const DEFAULT_INFO = {
  id: "default",
  nameGujarati: "શ્રીમતી ડી વી પટેલ ઉ.મા.શાળા ખડોદી બોરવાઈ",
  nameEnglish: "Shrimati DV Patel Upper Secondary School Khadodi Borwai",
  trustName: "શ્રી ખડોદી બોરવાઈ ગ્રુપ કેળવણી મંડળ ખડોદી બોરવાઈ",
  address: "મુકામ પોસ્ટ બોરવાઈ તાલુકો ખાનપુર જિલ્લો મહીસાગર પિન 389232 ગુજરાત ભારત",
  established: 1972,
  principalName: "શ્રી હરેશકુમાર ડાહ્યાભાઈ ભટ્ટ",
  principalMessage: null,
  presidentName: "શ્રી ત્રિવેદી રમણલાલ હીરાલાલ",
  secretaryName: "શ્રી જોશી પ્રવિણચંદ્ર પ્રેમશંકર",
  facilities: ["Modern Laboratory", "Computer Room", "Smart Board", "Kabaddi Ground", "Cricket Ground", "Basketball Ground", "Volleyball Ground"],
  logoUrl: null,
  totalStudents: null,
  totalStaff: null,
  totalYears: null,
};

function toJson(doc: any) {
  const obj = doc.toObject ? doc.toObject() : doc;
  return { ...obj, id: obj._id?.toString(), _id: undefined, __v: undefined, totalStudents: null, totalStaff: null, totalYears: null };
}

router.get("/school-info", async (_req, res) => {
  try {
    const info = await SchoolInfo.findOne();
    if (!info) { res.json(DEFAULT_INFO); return; }
    res.json(toJson(info));
  } catch (err) {
    logger.error({ err }, "Get school info error");
    res.status(500).json({ error: "Server error" });
  }
});

router.put("/school-info", requireAuth, async (req, res) => {
  try {
    const existing = await SchoolInfo.findOne();
    if (!existing) {
      const doc = await SchoolInfo.create(req.body);
      res.json(toJson(doc));
      return;
    }
    const doc = await SchoolInfo.findByIdAndUpdate(existing._id, req.body, { new: true });
    res.json(toJson(doc));
  } catch (err) {
    logger.error({ err }, "Update school info error");
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
