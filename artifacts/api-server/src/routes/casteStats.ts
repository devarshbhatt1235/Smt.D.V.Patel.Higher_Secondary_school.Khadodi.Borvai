import { Router } from "express";
import { CasteStats } from "../models/CasteStats";
import { requireAuth } from "../middlewares/auth";
import { logger } from "../lib/logger";

const router = Router();

function toJson(doc: any) {
  const obj = doc.toObject ? doc.toObject() : doc;
  return { ...obj, id: obj._id?.toString(), _id: undefined, __v: undefined };
}

router.get("/caste-stats", async (_req, res) => {
  try {
    const stats = await CasteStats.findOne();
    if (!stats) {
      res.json({ id: "default", stBoys: 0, stGirls: 0, obcBoys: 0, obcGirls: 0, scBoys: 0, scGirls: 0, generalBoys: 0, generalGirls: 0 });
      return;
    }
    res.json(toJson(stats));
  } catch (err) {
    logger.error({ err }, "Get caste stats error");
    res.status(500).json({ error: "Server error" });
  }
});

router.put("/caste-stats", requireAuth, async (req, res) => {
  try {
    const existing = await CasteStats.findOne();
    if (!existing) {
      const doc = await CasteStats.create(req.body);
      res.json(toJson(doc));
      return;
    }
    const doc = await CasteStats.findByIdAndUpdate(existing._id, req.body, { new: true });
    res.json(toJson(doc));
  } catch (err) {
    logger.error({ err }, "Update caste stats error");
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
