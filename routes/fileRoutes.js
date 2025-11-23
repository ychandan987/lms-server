import express from "express";
import multer from "multer";
import { uploadOnCloudinary } from "../utils/uploadOnCloudinary.js";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const router = express.Router();
const upload = multer({ dest: "uploads/" }); // Temporary folder

// POST /api/upload
router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const userId = req.body.userId ? parseInt(req.body.userId) : null;
    const file = req.file;

    if (!file) return res.status(400).json({ message: "No file uploaded" });

    const uploadedFile = await uploadOnCloudinary(file.path, userId);
    console.log("Uploaded file:", uploadedFile);
    

    if (!uploadedFile)
      return res.status(500).json({ message: "Upload failed" });

    res.status(200).json({
      success: true,
      message: "File uploaded successfully",
      data: uploadedFile,
    });
  } catch (error) {
    console.error("Error in upload route:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// GET all uploaded files
router.get("/upload", async (req, res) => {
  try {
    const files = await prisma.video.findMany({
      orderBy: { id: "desc" },
    });
    res.status(200).json(files);
    // res.status(200).json({
    //   success: true,
    //   message: "Files fetched successfully",
    //   data: files,
    // });
  } catch (error) {
    console.error("Error fetching files:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});


export default router;
