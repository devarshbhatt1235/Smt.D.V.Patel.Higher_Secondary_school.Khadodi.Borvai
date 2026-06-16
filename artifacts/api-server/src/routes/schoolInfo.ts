import { Router } from "express";
import { db, schoolInfoTable } from "@workspace/db";
import { requireAuth } from "../middlewares/auth";
import { logger } from "../lib/logger";

const router = Router();

router.get("/school-info", async (_req, res) => {
  try {
    const [info] = await db.select().from(schoolInfoTable).limit(1);
    if (!info) {
      res.json({
        id: 0,
        nameGujarati: "શ્રીમતી ડી વી પટેલ ઉ.મા.શાળા ખડોદી બોરવાઈ",
        nameEnglish: "Shrimati DV Patel Upper Secondary School Khadodi Borwai",
        trustName: "શ્રી ખડોદી બોરવાઈ ગ્રુપ કેળવણી મંડળ ખડોદી બોરવાઈ",
        address: "મુકામ પોસ્ટ બોરવાઈ તાલુકો ખાનપુર જિલ્લો મહીસાગર પિન 389232 ગુજરાત ભારત",
        established: 1972,
        principalMessage: null,
        principalName: "શ્રી હરેશકુમાર ડાહ્યાભાઈ ભટ્ટ",
        presidentName: "શ્રી ત્રિવેદી રમણલાલ હીરાલાલ",
        secretaryName: "શ્રી જોશી પ્રવિણચંદ્ર પ્રેમશંકર",
        facilities: ["Modern Laboratory", "Computer Room", "Smart Board", "Kabaddi Ground", "Cricket Ground", "Basketball Ground", "Volleyball Ground"],
        totalStudents: null,
        totalStaff: null,
        totalYears: null,
      });
      return;
    }
    res.json({ ...info, totalStudents: null, totalStaff: null, totalYears: null });
  } catch (err) {
    logger.error({ err }, "Get school info error");
    res.status(500).json({ error: "Server error" });
  }
});

router.put("/school-info", requireAuth, async (req, res) => {
  try {
    const [existing] = await db.select().from(schoolInfoTable).limit(1);
    if (!existing) {
      const [created] = await db.insert(schoolInfoTable).values(req.body).returning();
      res.json({ ...created, totalStudents: null, totalStaff: null, totalYears: null });
      return;
    }
    const [updated] = await db.update(schoolInfoTable).set(req.body).returning();
    res.json({ ...updated, totalStudents: null, totalStaff: null, totalYears: null });
  } catch (err) {
    logger.error({ err }, "Update school info error");
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
