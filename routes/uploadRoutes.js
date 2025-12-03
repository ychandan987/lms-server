import express from "express";
import multer from "multer";
import cloudinary from "../config/cloudinary.js";
import { Readable } from "stream";

const router = express.Router();

// Multer: store file temporarily in memory
const upload = multer({ storage: multer.memoryStorage() });

router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const readable = new Readable();
    readable.push(req.file.buffer);
    readable.push(null);

    const uploadResult = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "lms_uploads" },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      readable.pipe(stream);
    });

    res.status(200).json({
      url: uploadResult.secure_url,
      public_id: uploadResult.public_id,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
