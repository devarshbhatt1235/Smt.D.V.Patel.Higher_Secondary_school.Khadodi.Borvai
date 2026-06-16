import { Router } from "express";
import { db, galleryTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { requireAuth } from "../middlewares/auth";
import { logger } from "../lib/logger";

const router = Router();

router.get("/gallery", async (_req, res) => {
  try {
    const rows = await db.select().from(galleryTable).orderBy(galleryTable.createdAt);
    res.json(rows.map(r => ({ ...r, createdAt: r.createdAt.toISOString() })));
  } catch (err) {
    logger.error({ err }, "Get gallery error");
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/gallery", requireAuth, async (req, res) => {
  try {
    const [created] = await db.insert(galleryTable).values(req.body).returning();
    res.status(201).json({ ...created, createdAt: created.createdAt.toISOString() });
  } catch (err) {
    logger.error({ err }, "Create gallery photo error");
    res.status(500).json({ error: "Server error" });
  }
});

router.delete("/gallery/:id", requireAuth, async (req, res) => {
  try {
    const id = parseInt(req.params["id"] as string);
    await db.delete(galleryTable).where(eq(galleryTable.id, id));
    res.status(204).end();
  } catch (err) {
    logger.error({ err }, "Delete gallery photo error");
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
