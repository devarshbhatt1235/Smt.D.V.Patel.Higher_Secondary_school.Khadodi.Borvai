import { Router } from "express";
import { Staff } from "../models/Staff";
import { requireAuth } from "../middlewares/auth";
import { logger } from "../lib/logger";

const router = Router();

function toJson(doc: any) {
  const obj = doc.toObject ? doc.toObject() : doc;
  return { ...obj, id: obj._id?.toString(), _id: undefined, __v: undefined };
}

router.get("/staff", async (req, res) => {
  try {
    const search = req.query.search as string | undefined;
    const subject = req.query.subject as string | undefined;
    let query: any = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { qualification: { $regex: search, $options: "i" } },
      ];
    }
    if (subject) {
      query.subjectsTaught = { $elemMatch: { $regex: subject, $options: "i" } };
    }
    const rows = await Staff.find(query).sort({ name: 1 });
    res.json(rows.map(toJson));
  } catch (err) {
    logger.error({ err }, "Get staff error");
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/staff", requireAuth, async (req, res) => {
  try {
    const doc = await Staff.create(req.body);
    res.status(201).json(toJson(doc));
  } catch (err) {
    logger.error({ err }, "Create staff error");
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/staff/:id", async (req, res) => {
  try {
    const doc = await Staff.findById(req.params["id"]);
    if (!doc) { res.status(404).json({ error: "Not found" }); return; }
    res.json(toJson(doc));
  } catch (err) {
    logger.error({ err }, "Get staff by id error");
    res.status(500).json({ error: "Server error" });
  }
});

router.patch("/staff/:id", requireAuth, async (req, res) => {
  try {
    const doc = await Staff.findByIdAndUpdate(req.params["id"], req.body, { new: true });
    if (!doc) { res.status(404).json({ error: "Not found" }); return; }
    res.json(toJson(doc));
  } catch (err) {
    logger.error({ err }, "Update staff error");
    res.status(500).json({ error: "Server error" });
  }
});

router.delete("/staff/:id", requireAuth, async (req, res) => {
  try {
    await Staff.findByIdAndDelete(req.params["id"]);
    res.status(204).end();
  } catch (err) {
    logger.error({ err }, "Delete staff error");
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
