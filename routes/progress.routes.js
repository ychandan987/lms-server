import express from "express";
import { auth } from "../middlewares/auth.js";
import { markLessonComplete } from "../Controller/progress.controller.js";

const router = express.Router();

router.post("/complete", auth, markLessonComplete);

export default router;
