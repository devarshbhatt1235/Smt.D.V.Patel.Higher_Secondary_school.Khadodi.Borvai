import { Router } from "express";
import bcrypt from "bcrypt";
import { db, adminsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { signToken, requireAuth, type AuthRequest } from "../middlewares/auth";
import { logger } from "../lib/logger";

const router = Router();

router.post("/auth/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ error: "Email and password required" });
    return;
  }
  try {
    const [admin] = await db.select().from(adminsTable).where(eq(adminsTable.email, email)).limit(1);
    if (!admin) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }
    const valid = await bcrypt.compare(password, admin.passwordHash);
    if (!valid) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }
    const token = signToken(admin.id);
    res.json({ token, admin: { id: admin.id, email: admin.email, name: admin.name } });
  } catch (err) {
    logger.error({ err }, "Login error");
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/auth/me", requireAuth, async (req: AuthRequest, res) => {
  try {
    const [admin] = await db.select().from(adminsTable).where(eq(adminsTable.id, req.adminId!)).limit(1);
    if (!admin) {
      res.status(404).json({ error: "Admin not found" });
      return;
    }
    res.json({ id: admin.id, email: admin.email, name: admin.name });
  } catch (err) {
    logger.error({ err }, "Get me error");
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
