import { Router } from "express";
import bcrypt from "bcrypt";
import { Admin } from "../models/Admin";
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
    const admin = await Admin.findOne({ email });
    if (!admin) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }
    const valid = await bcrypt.compare(password, admin.passwordHash);
    if (!valid) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }
    const token = signToken(admin._id.toString());
    res.json({ token, admin: { id: admin._id.toString(), email: admin.email, name: admin.name } });
  } catch (err) {
    logger.error({ err }, "Login error");
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/auth/me", requireAuth, async (req: AuthRequest, res) => {
  try {
    const admin = await Admin.findById(req.adminId);
    if (!admin) {
      res.status(401).json({ error: "Admin not found" });
      return;
    }
    res.json({ id: admin._id.toString(), email: admin.email, name: admin.name });
  } catch (err: any) {
    if (err?.name === "CastError") {
      res.status(401).json({ error: "Invalid token" });
      return;
    }
    logger.error({ err }, "Get me error");
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
