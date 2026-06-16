import { Router } from "express";
import { db, contactTable } from "@workspace/db";
import { requireAuth } from "../middlewares/auth";
import { logger } from "../lib/logger";

const router = Router();

router.get("/contact", async (_req, res) => {
  try {
    const [contact] = await db.select().from(contactTable).limit(1);
    if (!contact) {
      res.json({ id: 0, phone: null, email: "dvpatelhighschool@gmail.com", mapLink: null, facebookUrl: null, whatsappNumber: null, youtubeUrl: null });
      return;
    }
    res.json(contact);
  } catch (err) {
    logger.error({ err }, "Get contact error");
    res.status(500).json({ error: "Server error" });
  }
});

router.put("/contact", requireAuth, async (req, res) => {
  try {
    const [existing] = await db.select().from(contactTable).limit(1);
    if (!existing) {
      const [created] = await db.insert(contactTable).values(req.body).returning();
      res.json(created);
      return;
    }
    const [updated] = await db.update(contactTable).set(req.body).returning();
    res.json(updated);
  } catch (err) {
    logger.error({ err }, "Update contact error");
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
