import { Router } from "express";
import { Gallery } from "../models/Gallery";
import cloudinary from "../lib/cloudinary";
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
  };
}

router.get("/gallery", async (_req, res) => {
  try {
    const rows = await Gallery.find().sort({ createdAt: -1 });
    res.json(rows.map(toJson));
  } catch (err) {
    logger.error({ err }, "Get gallery error");
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/gallery", requireAuth, async (req, res) => {
  try {
    const doc = await Gallery.create(req.body);
    res.status(201).json(toJson(doc));
  } catch (err) {
    logger.error({ err }, "Create gallery photo error");
    res.status(500).json({ error: "Server error" });
  }
});

router.delete("/gallery/:id", requireAuth, async (req, res) => {
  try {
    const doc = await Gallery.findById(req.params["id"]);
    if (doc?.cloudinaryId) {
      await cloudinary.uploader.destroy(doc.cloudinaryId).catch(() => {});
    }
    await Gallery.findByIdAndDelete(req.params["id"]);
    res.status(204).end();
  } catch (err) {
    logger.error({ err }, "Delete gallery photo error");
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
