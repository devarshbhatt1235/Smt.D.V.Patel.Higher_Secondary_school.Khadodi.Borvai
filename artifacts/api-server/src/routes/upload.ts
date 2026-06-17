import { Router } from "express";
import multer from "multer";
import { requireAuth } from "../middlewares/auth";
import { logger } from "../lib/logger";
import cloudinary from "../lib/cloudinary";

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

const router = Router();

router.post("/upload", requireAuth, upload.single("file"), async (req, res) => {
  if (!req.file) {
    res.status(400).json({ error: "No file uploaded" });
    return;
  }
  try {
    const result = await new Promise<any>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "dvpatel_school", resource_type: "auto" },
        (err, result) => { if (err) reject(err); else resolve(result); }
      );
      stream.end(req.file!.buffer);
    });
    res.json({ url: result.secure_url, cloudinaryId: result.public_id });
  } catch (err) {
    logger.error({ err }, "Cloudinary upload error");
    res.status(500).json({ error: "Upload failed" });
  }
});

export default router;
