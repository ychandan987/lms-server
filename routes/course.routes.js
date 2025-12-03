import express from "express";
import {
  createCourse,
  getCourses,
  getCourse,
  updateCourse,
  deleteCourse,
  publishCourse,
  unpublishCourse,
  duplicateCourse,
} from "../Controller/course.controller.js";

const router = express.Router();

router.get("/", getCourses);
router.get("/:id", getCourse);
router.post("/", createCourse);
router.put("/:id", updateCourse);
router.delete("/:id", deleteCourse);
router.post("/:id/publish", publishCourse);
router.post("/:id/unpublish", unpublishCourse);
router.post("/:id/duplicate", duplicateCourse);

export default router;
