import express from "express";
import { uploadThumbnail, uploadVideoUrl } from "../Controller/upload.controller.js";

const router = express.Router();

router.post("/thumbnail", uploadThumbnail);
router.post("/video-url", uploadVideoUrl);

export default router;

