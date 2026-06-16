import { Router } from "express";
import { db, noticesTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { requireAuth } from "../middlewares/auth";
import { logger } from "../lib/logger";

const router = Router();

router.get("/notices", async (req, res) => {
  try {
    const published = req.query.published as string | undefined;
    let rows = await db.select().from(noticesTable).orderBy(noticesTable.createdAt);
    if (published !== undefined) {
      const pub = published === "true";
      rows = rows.filter(n => n.published === pub);
    }
    res.json(rows.map(n => ({ ...n, createdAt: n.createdAt.toISOString(), updatedAt: n.updatedAt.toISOString() })));
  } catch (err) {
    logger.error({ err }, "Get notices error");
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/notices", requireAuth, async (req, res) => {
  try {
    const [created] = await db.insert(noticesTable).values(req.body).returning();
    res.status(201).json({ ...created, createdAt: created.createdAt.toISOString(), updatedAt: created.updatedAt.toISOString() });
  } catch (err) {
    logger.error({ err }, "Create notice error");
    res.status(500).json({ error: "Server error" });
  }
});

router.patch("/notices/:id", requireAuth, async (req, res) => {
  try {
    const id = parseInt(req.params["id"] as string);
    const [updated] = await db.update(noticesTable).set(req.body).where(eq(noticesTable.id, id)).returning();
    if (!updated) { res.status(404).json({ error: "Not found" }); return; }
    res.json({ ...updated, createdAt: updated.createdAt.toISOString(), updatedAt: updated.updatedAt.toISOString() });
  } catch (err) {
    logger.error({ err }, "Update notice error");
    res.status(500).json({ error: "Server error" });
  }
});

router.delete("/notices/:id", requireAuth, async (req, res) => {
  try {
    const id = parseInt(req.params["id"] as string);
    await db.delete(noticesTable).where(eq(noticesTable.id, id));
    res.status(204).end();
  } catch (err) {
    logger.error({ err }, "Delete notice error");
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
