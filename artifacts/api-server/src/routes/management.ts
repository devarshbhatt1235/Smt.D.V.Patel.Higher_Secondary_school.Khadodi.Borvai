import { Router } from "express";
import { Management } from "../models/Management";
import { requireAuth } from "../middlewares/auth";
import { logger } from "../lib/logger";

const router = Router();

function toJson(doc: any) {
  const obj = doc.toObject ? doc.toObject() : doc;
  return { ...obj, id: obj._id?.toString(), _id: undefined, __v: undefined };
}

router.get("/management", async (_req, res) => {
  try {
    const rows = await Management.find().sort({ order: 1, name: 1 });
    res.json(rows.map(toJson));
  } catch (err) {
    logger.error({ err }, "Get management error");
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/management", requireAuth, async (req, res) => {
  try {
    const doc = await Management.create(req.body);
    res.status(201).json(toJson(doc));
  } catch (err) {
    logger.error({ err }, "Create management member error");
    res.status(500).json({ error: "Server error" });
  }
});

router.patch("/management/:id", requireAuth, async (req, res) => {
  try {
    const doc = await Management.findByIdAndUpdate(req.params["id"], req.body, { new: true });
    if (!doc) { res.status(404).json({ error: "Not found" }); return; }
    res.json(toJson(doc));
  } catch (err) {
    logger.error({ err }, "Update management member error");
    res.status(500).json({ error: "Server error" });
  }
});

router.delete("/management/:id", requireAuth, async (req, res) => {
  try {
    await Management.findByIdAndDelete(req.params["id"]);
    res.status(204).end();
  } catch (err) {
    logger.error({ err }, "Delete management member error");
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
