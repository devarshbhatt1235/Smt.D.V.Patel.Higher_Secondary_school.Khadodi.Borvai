import { Router } from "express";
import { db, staffTable, studentsTable, noticesTable, galleryTable } from "@workspace/db";
import { count } from "drizzle-orm";
import { logger } from "../lib/logger";

const router = Router();

router.get("/dashboard/stats", async (_req, res) => {
  try {
    const [staffCount] = await db.select({ count: count() }).from(staffTable);
    const [noticeCount] = await db.select({ count: count() }).from(noticesTable);
    const [photoCount] = await db.select({ count: count() }).from(galleryTable);
    const allStudents = await db.select({ class: studentsTable.class }).from(studentsTable);

    const classCounts: Record<string, number> = {};
    for (const s of allStudents) {
      classCounts[s.class] = (classCounts[s.class] ?? 0) + 1;
    }
    const studentsByClass = Object.entries(classCounts).map(([cls, cnt]) => ({ class: cls, count: cnt }));

    res.json({
      totalStudents: allStudents.length,
      totalStaff: staffCount.count,
      totalNotices: noticeCount.count,
      totalPhotos: photoCount.count,
      studentsByClass,
    });
  } catch (err) {
    logger.error({ err }, "Get dashboard stats error");
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
