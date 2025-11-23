import { Router } from "express";
import userRoutes from "./userRoutes.js"; 
import groupRoutes from "./groupRoutes.js";
import userGroupRoutes from "./userGroupRoutes.js";
import calendarRoutes  from "./calendarRoutes.js";
import authRoutes from "./authRoutes.js";
import fileRoutes from "./fileRoutes.js";
import dashboard from "./dashboard.js";
import nodemailerRoutes from "./nodemailerRoutes.js";  
import courseRoutes from "./courseRoutes.js";


const router = Router();

router.use("/api/user", userRoutes);
router.use("/api/group", groupRoutes);
router.use("/api/usergroup", userGroupRoutes);
router.use("/api/events", calendarRoutes);
router.use("/api/auth", authRoutes);   
router.use("/api/video", fileRoutes);
router.use("/api/dashboard", dashboard);
router.use("/api/mail", nodemailerRoutes);
router.use("/api/course", courseRoutes);

export default router;