import { Router } from "express";
import { TopStudent } from "../models/TopStudent";
import { requireAuth } from "../middlewares/auth";
import { logger } from "../lib/logger";

const router = Router();

function toJson(doc: any) {
  const obj = doc.toObject ? doc.toObject() : doc;
  return { ...obj, id: obj._id?.toString(), _id: undefined, __v: undefined };
}

router.get("/top-students", async (req, res) => {
  try {
    const cls = req.query["class"] as string | undefined;
    const year = req.query.year as string | undefined;
    const query: any = {};
    if (cls) query.class = cls;
    if (year) query.year = year;
    const rows = await TopStudent.find(query).sort({ rank: 1 });
    res.json(rows.map(toJson));
  } catch (err) {
    logger.error({ err }, "Get top students error");
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/top-students", requireAuth, async (req, res) => {
  try {
    const doc = await TopStudent.create(req.body);
    res.status(201).json(toJson(doc));
  } catch (err) {
    logger.error({ err }, "Create top student error");
    res.status(500).json({ error: "Server error" });
  }
});

router.patch("/top-students/:id", requireAuth, async (req, res) => {
  try {
    const doc = await TopStudent.findByIdAndUpdate(req.params["id"], req.body, { new: true });
    if (!doc) { res.status(404).json({ error: "Not found" }); return; }
    res.json(toJson(doc));
  } catch (err) {
    logger.error({ err }, "Update top student error");
    res.status(500).json({ error: "Server error" });
  }
});

router.delete("/top-students/:id", requireAuth, async (req, res) => {
  try {
    await TopStudent.findByIdAndDelete(req.params["id"]);
    res.status(204).end();
  } catch (err) {
    logger.error({ err }, "Delete top student error");
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
