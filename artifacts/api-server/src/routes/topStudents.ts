import { Router } from "express";
import { db, topStudentsTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";
import { requireAuth } from "../middlewares/auth";
import { logger } from "../lib/logger";

const router = Router();

router.get("/top-students", async (req, res) => {
  try {
    const cls = req.query["class"] as string | undefined;
    const year = req.query.year as string | undefined;
    let rows = await db.select().from(topStudentsTable).orderBy(topStudentsTable.rank);
    if (cls) rows = rows.filter(s => s.class === cls);
    if (year) rows = rows.filter(s => s.year === year);
    res.json(rows.map(r => ({ ...r, percentage: r.percentage ? parseFloat(r.percentage) : null })));
  } catch (err) {
    logger.error({ err }, "Get top students error");
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/top-students", requireAuth, async (req, res) => {
  try {
    const [created] = await db.insert(topStudentsTable).values(req.body).returning();
    res.status(201).json({ ...created, percentage: created.percentage ? parseFloat(created.percentage) : null });
  } catch (err) {
    logger.error({ err }, "Create top student error");
    res.status(500).json({ error: "Server error" });
  }
});

router.patch("/top-students/:id", requireAuth, async (req, res) => {
  try {
    const id = parseInt(req.params["id"] as string);
    const [updated] = await db.update(topStudentsTable).set(req.body).where(eq(topStudentsTable.id, id)).returning();
    if (!updated) { res.status(404).json({ error: "Not found" }); return; }
    res.json({ ...updated, percentage: updated.percentage ? parseFloat(updated.percentage) : null });
  } catch (err) {
    logger.error({ err }, "Update top student error");
    res.status(500).json({ error: "Server error" });
  }
});

router.delete("/top-students/:id", requireAuth, async (req, res) => {
  try {
    const id = parseInt(req.params["id"] as string);
    await db.delete(topStudentsTable).where(eq(topStudentsTable.id, id));
    res.status(204).end();
  } catch (err) {
    logger.error({ err }, "Delete top student error");
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
