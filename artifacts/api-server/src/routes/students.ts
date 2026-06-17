import { Router } from "express";
import { Student } from "../models/Student";
import { requireAuth } from "../middlewares/auth";
import { logger } from "../lib/logger";

const router = Router();

function toJson(doc: any) {
  const obj = doc.toObject ? doc.toObject() : doc;
  return { ...obj, id: obj._id?.toString(), _id: undefined, __v: undefined };
}

router.get("/students", async (req, res) => {
  try {
    const cls = req.query["class"] as string | undefined;
    const search = req.query.search as string | undefined;
    const gender = req.query.gender as string | undefined;
    const query: any = {};
    if (cls) query.class = cls;
    if (gender) query.gender = gender;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { grNumber: { $regex: search, $options: "i" } },
      ];
    }
    const rows = await Student.find(query).sort({ name: 1 });
    res.json(rows.map(toJson));
  } catch (err) {
    logger.error({ err }, "Get students error");
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/students", requireAuth, async (req, res) => {
  try {
    const doc = await Student.create(req.body);
    res.status(201).json(toJson(doc));
  } catch (err) {
    logger.error({ err }, "Create student error");
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/students/stats/summary", async (_req, res) => {
  try {
    const allStudents = await Student.find();
    const classGroups: Record<string, { count: number; boys: number; girls: number }> = {};
    let boys = 0, girls = 0;
    for (const s of allStudents) {
      const cls = s.class;
      if (!classGroups[cls]) classGroups[cls] = { count: 0, boys: 0, girls: 0 };
      classGroups[cls].count++;
      if (s.gender === "Male" || s.gender === "Boy" || s.gender === "M") { classGroups[cls].boys++; boys++; }
      else if (s.gender === "Female" || s.gender === "Girl" || s.gender === "F") { classGroups[cls].girls++; girls++; }
    }
    const byClass = Object.entries(classGroups).map(([c, d]) => ({ class: c, ...d }));
    res.json({ total: allStudents.length, byClass, byGender: { boys, girls } });
  } catch (err) {
    logger.error({ err }, "Get student stats error");
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/students/:id", async (req, res) => {
  try {
    const doc = await Student.findById(req.params["id"]);
    if (!doc) { res.status(404).json({ error: "Not found" }); return; }
    res.json(toJson(doc));
  } catch (err) {
    logger.error({ err }, "Get student by id error");
    res.status(500).json({ error: "Server error" });
  }
});

router.patch("/students/:id", requireAuth, async (req, res) => {
  try {
    const doc = await Student.findByIdAndUpdate(req.params["id"], req.body, { new: true });
    if (!doc) { res.status(404).json({ error: "Not found" }); return; }
    res.json(toJson(doc));
  } catch (err) {
    logger.error({ err }, "Update student error");
    res.status(500).json({ error: "Server error" });
  }
});

router.delete("/students/:id", requireAuth, async (req, res) => {
  try {
    await Student.findByIdAndDelete(req.params["id"]);
    res.status(204).end();
  } catch (err) {
    logger.error({ err }, "Delete student error");
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
