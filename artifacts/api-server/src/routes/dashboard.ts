import { Router } from "express";
import { Staff } from "../models/Staff";
import { Student } from "../models/Student";
import { Notice } from "../models/Notice";
import { Gallery } from "../models/Gallery";
import { logger } from "../lib/logger";

const router = Router();

router.get("/dashboard/stats", async (_req, res) => {
  try {
    const [totalStaff, totalNotices, totalPhotos, allStudents] = await Promise.all([
      Staff.countDocuments(),
      Notice.countDocuments(),
      Gallery.countDocuments(),
      Student.find({}, { class: 1 }),
    ]);

    const classCounts: Record<string, number> = {};
    for (const s of allStudents) {
      classCounts[s.class] = (classCounts[s.class] ?? 0) + 1;
    }
    const studentsByClass = Object.entries(classCounts).map(([cls, count]) => ({ class: cls, count }));

    res.json({
      totalStudents: allStudents.length,
      totalStaff,
      totalNotices,
      totalPhotos,
      studentsByClass,
    });
  } catch (err) {
    logger.error({ err }, "Get dashboard stats error");
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
