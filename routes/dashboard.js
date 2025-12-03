import express from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = express.Router();

router.get("/stats", async (req, res) => {
  try {
    // 🧮 Fetch counts from your database
    const totalUsers = await prisma.user.count();
    // const activeCourses = await prisma.course.count({
    //   where: { active: true },
    // });
    const activeCourses = "50";
    // const certificatesIssued = await prisma.certificate.count();
    const certificatesIssued = "25";

    // 🧩 Calculate completion rate
    // const totalEnrollments = await prisma.enrollment.count();
    // const completedCourses = await prisma.enrollment.count({
    //   where: { completed: true },
    // });
    const totalEnrollments = "200";
    const completedCourses = "150";
    const completionRate =
      totalEnrollments === 0
        ? 0
        : Math.round((completedCourses / totalEnrollments) * 100);

    // 📈 Optional: dummy changes (could be replaced with real logic later)
    const changes = {
      totalUsers: "+12%",
      activeCourses: "+3%",
      completionRate: "-2%",
      certificatesIssued: "+18%",
    };

    // ✅ Send the response
    res.status(200).json({
      totalUsers,
      activeCourses,
      completionRate,
      certificatesIssued,
      changes,
    });
  } catch (error) {
    console.error("❌ Error fetching dashboard stats:", error);
    res.status(500).json({ error: "Failed to fetch dashboard stats" });
  }
});

export default router;