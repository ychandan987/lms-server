import { Router } from "express";
import userRoutes from "./userRoutes.js"; 
import groupRoutes from "./groupRoutes.js";
import userGroupRoutes from "./userGroupRoutes.js";
import calendarRoutes  from "./calendarRoutes.js";
import authRoutes from "./authRoutes.js";
import fileRoutes from "./fileRoutes.js";
import dashboard from "./dashboard.js";
import nodemailerRoutes from "./nodemailerRoutes.js";  
import courseRoutes from "./course.routes.js";
import chapterRoutes from "./chapter.routes.js";
import lessonRoutes from "./lesson.routes.js";
import quizRoutes from "./quiz.routes.js";
import progressRoutes from "./progress.routes.js";
import uploadRoutes from "./upload.routes.js";
import uploadRoute from "./uploadRoutes.js";    


const router = Router();

router.use("/api/user", userRoutes);
router.use("/api/group", groupRoutes);
router.use("/api/usergroup", userGroupRoutes);
router.use("/api/events", calendarRoutes);
router.use("/api/auth", authRoutes);   
router.use("/api/video", fileRoutes);
router.use("/api/dashboard", dashboard);
router.use("/api/mail", nodemailerRoutes);
// router.use("/api/course", courseRoutes);
router.use("/api/courses", courseRoutes);
router.use("/api/chapters", chapterRoutes);
router.use("/api/lessons", lessonRoutes);
router.use("/api/quizzes", quizRoutes);
router.use("/api/progress", progressRoutes);
router.use("/api/upload", uploadRoutes);
router.use("/api/upload", uploadRoute);

export default router;