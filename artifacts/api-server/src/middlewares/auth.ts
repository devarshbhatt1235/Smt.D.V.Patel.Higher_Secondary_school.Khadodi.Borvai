import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env["JWT_SECRET"] ?? "school_jwt_secret_dvpatel_2024";

export interface AuthRequest extends Request {
  adminId?: string;
}

export function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const token = authHeader.slice(7);
  try {
    const payload = jwt.verify(token, JWT_SECRET) as { adminId: string };
    req.adminId = payload.adminId;
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
}

export function signToken(adminId: string): string {
  return jwt.sign({ adminId }, JWT_SECRET, { expiresIn: "30d" });
}
