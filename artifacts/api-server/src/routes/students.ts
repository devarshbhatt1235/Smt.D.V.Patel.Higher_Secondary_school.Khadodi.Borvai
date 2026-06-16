import { Router } from "express";
import { db, studentsTable } from "@workspace/db";
import { eq, sql } from "drizzle-orm";
import { requireAuth } from "../middlewares/auth";
import { logger } from "../lib/logger";

const router = Router();

router.get("/students", async (req, res) => {
  try {
    const cls = req.query["class"] as string | undefined;
    const search = req.query.search as string | undefined;
    const gender = req.query.gender as string | undefined;
    let rows = await db.select().from(studentsTable).orderBy(studentsTable.name);
    if (cls) rows = rows.filter(s => s.class === cls);
    if (gender) rows = rows.filter(s => s.gender === gender);
    if (search) rows = rows.filter(s => s.name.toLowerCase().includes(search.toLowerCase()) || s.grNumber.includes(search));
    res.json(rows);
  } catch (err) {
    logger.error({ err }, "Get students error");
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/students", requireAuth, async (req, res) => {
  try {
    const [created] = await db.insert(studentsTable).values(req.body).returning();
    res.status(201).json(created);
  } catch (err) {
    logger.error({ err }, "Create student error");
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/students/stats/summary", async (_req, res) => {
  try {
    const allStudents = await db.select().from(studentsTable);
    const classGroups: Record<string, { count: number; boys: number; girls: number }> = {};
    let boys = 0, girls = 0;
    for (const s of allStudents) {
      if (!classGroups[s.class]) classGroups[s.class] = { count: 0, boys: 0, girls: 0 };
      classGroups[s.class].count++;
      if (s.gender === "Male" || s.gender === "Boy") { classGroups[s.class].boys++; boys++; }
      else if (s.gender === "Female" || s.gender === "Girl") { classGroups[s.class].girls++; girls++; }
    }
    const byClass = Object.entries(classGroups).map(([cls, data]) => ({ class: cls, ...data }));
    res.json({ total: allStudents.length, byClass, byGender: { boys, girls } });
  } catch (err) {
    logger.error({ err }, "Get student stats error");
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/students/:id", async (req, res) => {
  try {
    const id = parseInt(req.params["id"] as string);
    const [student] = await db.select().from(studentsTable).where(eq(studentsTable.id, id)).limit(1);
    if (!student) { res.status(404).json({ error: "Not found" }); return; }
    res.json(student);
  } catch (err) {
    logger.error({ err }, "Get student by id error");
    res.status(500).json({ error: "Server error" });
  }
});

router.patch("/students/:id", requireAuth, async (req, res) => {
  try {
    const id = parseInt(req.params["id"] as string);
    const [updated] = await db.update(studentsTable).set(req.body).where(eq(studentsTable.id, id)).returning();
    if (!updated) { res.status(404).json({ error: "Not found" }); return; }
    res.json(updated);
  } catch (err) {
    logger.error({ err }, "Update student error");
    res.status(500).json({ error: "Server error" });
  }
});

router.delete("/students/:id", requireAuth, async (req, res) => {
  try {
    const id = parseInt(req.params["id"] as string);
    await db.delete(studentsTable).where(eq(studentsTable.id, id));
    res.status(204).end();
  } catch (err) {
    logger.error({ err }, "Delete student error");
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
