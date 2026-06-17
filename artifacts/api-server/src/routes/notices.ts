import { Router } from "express";
import { Notice } from "../models/Notice";
import { requireAuth } from "../middlewares/auth";
import { logger } from "../lib/logger";

const router = Router();

function toJson(doc: any) {
  const obj = doc.toObject ? doc.toObject() : doc;
  return {
    ...obj,
    id: obj._id?.toString(),
    _id: undefined,
    __v: undefined,
    createdAt: obj.createdAt?.toISOString?.() ?? obj.createdAt,
    updatedAt: obj.updatedAt?.toISOString?.() ?? obj.updatedAt,
  };
}

router.get("/notices", async (req, res) => {
  try {
    const published = req.query.published as string | undefined;
    const query: any = {};
    if (published !== undefined) query.published = published === "true";
    const rows = await Notice.find(query).sort({ createdAt: -1 });
    res.json(rows.map(toJson));
  } catch (err) {
    logger.error({ err }, "Get notices error");
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/notices", requireAuth, async (req, res) => {
  try {
    const doc = await Notice.create(req.body);
    res.status(201).json(toJson(doc));
  } catch (err) {
    logger.error({ err }, "Create notice error");
    res.status(500).json({ error: "Server error" });
  }
});

router.patch("/notices/:id", requireAuth, async (req, res) => {
  try {
    const doc = await Notice.findByIdAndUpdate(req.params["id"], req.body, { new: true });
    if (!doc) { res.status(404).json({ error: "Not found" }); return; }
    res.json(toJson(doc));
  } catch (err) {
    logger.error({ err }, "Update notice error");
    res.status(500).json({ error: "Server error" });
  }
});

router.delete("/notices/:id", requireAuth, async (req, res) => {
  try {
    await Notice.findByIdAndDelete(req.params["id"]);
    res.status(204).end();
  } catch (err) {
    logger.error({ err }, "Delete notice error");
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
