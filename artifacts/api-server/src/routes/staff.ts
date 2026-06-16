import { Router } from "express";
import { db, staffTable } from "@workspace/db";
import { eq, ilike, or } from "drizzle-orm";
import { requireAuth } from "../middlewares/auth";
import { logger } from "../lib/logger";

const router = Router();

router.get("/staff", async (req, res) => {
  try {
    const search = req.query.search as string | undefined;
    const subject = req.query.subject as string | undefined;
    let rows = await db.select().from(staffTable).orderBy(staffTable.name);
    if (search) {
      rows = rows.filter(s => s.name.toLowerCase().includes(search.toLowerCase()) || (s.qualification ?? "").toLowerCase().includes(search.toLowerCase()));
    }
    if (subject) {
      rows = rows.filter(s => s.subjectsTaught.some((sub: string) => sub.toLowerCase().includes(subject.toLowerCase())));
    }
    res.json(rows);
  } catch (err) {
    logger.error({ err }, "Get staff error");
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/staff", requireAuth, async (req, res) => {
  try {
    const data = { ...req.body, subjectsTaught: req.body.subjectsTaught ?? [] };
    const [created] = await db.insert(staffTable).values(data).returning();
    res.status(201).json(created);
  } catch (err) {
    logger.error({ err }, "Create staff error");
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/staff/:id", async (req, res) => {
  try {
    const id = parseInt(req.params["id"] as string);
    const [staff] = await db.select().from(staffTable).where(eq(staffTable.id, id)).limit(1);
    if (!staff) { res.status(404).json({ error: "Not found" }); return; }
    res.json(staff);
  } catch (err) {
    logger.error({ err }, "Get staff by id error");
    res.status(500).json({ error: "Server error" });
  }
});

router.patch("/staff/:id", requireAuth, async (req, res) => {
  try {
    const id = parseInt(req.params["id"] as string);
    const [updated] = await db.update(staffTable).set(req.body).where(eq(staffTable.id, id)).returning();
    if (!updated) { res.status(404).json({ error: "Not found" }); return; }
    res.json(updated);
  } catch (err) {
    logger.error({ err }, "Update staff error");
    res.status(500).json({ error: "Server error" });
  }
});

router.delete("/staff/:id", requireAuth, async (req, res) => {
  try {
    const id = parseInt(req.params["id"] as string);
    await db.delete(staffTable).where(eq(staffTable.id, id));
    res.status(204).end();
  } catch (err) {
    logger.error({ err }, "Delete staff error");
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
