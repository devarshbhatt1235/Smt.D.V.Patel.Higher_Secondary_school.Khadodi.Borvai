import { Router } from "express";
import { db, casteStatsTable } from "@workspace/db";
import { requireAuth } from "../middlewares/auth";
import { logger } from "../lib/logger";

const router = Router();

router.get("/caste-stats", async (_req, res) => {
  try {
    const [stats] = await db.select().from(casteStatsTable).limit(1);
    if (!stats) {
      res.json({ id: 0, stBoys: 0, stGirls: 0, obcBoys: 0, obcGirls: 0, scBoys: 0, scGirls: 0, generalBoys: 0, generalGirls: 0 });
      return;
    }
    res.json(stats);
  } catch (err) {
    logger.error({ err }, "Get caste stats error");
    res.status(500).json({ error: "Server error" });
  }
});

router.put("/caste-stats", requireAuth, async (req, res) => {
  try {
    const [existing] = await db.select().from(casteStatsTable).limit(1);
    if (!existing) {
      const [created] = await db.insert(casteStatsTable).values(req.body).returning();
      res.json(created);
      return;
    }
    const [updated] = await db.update(casteStatsTable).set(req.body).returning();
    res.json(updated);
  } catch (err) {
    logger.error({ err }, "Update caste stats error");
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
