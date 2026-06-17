import { Router } from "express";
import { Contact } from "../models/Contact";
import { requireAuth } from "../middlewares/auth";
import { logger } from "../lib/logger";

const router = Router();

function toJson(doc: any) {
  const obj = doc.toObject ? doc.toObject() : doc;
  return { ...obj, id: obj._id?.toString(), _id: undefined, __v: undefined };
}

router.get("/contact", async (_req, res) => {
  try {
    const contact = await Contact.findOne();
    if (!contact) {
      res.json({ id: "default", phone: null, email: "dvpatelhighschool@gmail.com", mapLink: null, facebookUrl: null, whatsappNumber: null, youtubeUrl: null });
      return;
    }
    res.json(toJson(contact));
  } catch (err) {
    logger.error({ err }, "Get contact error");
    res.status(500).json({ error: "Server error" });
  }
});

router.put("/contact", requireAuth, async (req, res) => {
  try {
    const existing = await Contact.findOne();
    if (!existing) {
      const doc = await Contact.create(req.body);
      res.json(toJson(doc));
      return;
    }
    const doc = await Contact.findByIdAndUpdate(existing._id, req.body, { new: true });
    res.json(toJson(doc));
  } catch (err) {
    logger.error({ err }, "Update contact error");
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
