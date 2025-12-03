import express from "express";
import {
  createLesson,
  updateLesson,
  deleteLesson
} from "../Controller/lesson.controller.js";

const router = express.Router();

router.post("/", createLesson);
router.put("/:id", updateLesson);
router.delete("/:id", deleteLesson);

export default router;
