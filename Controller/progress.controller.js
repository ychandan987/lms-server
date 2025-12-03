import prisma from "../DB/db.config.js";

export const markLessonComplete = async (req, res) => {
  try {
    const { lessonId } = req.body;
    const userId = req.user.id;

    const existing = await prisma.progress.findFirst({
      where: { userId, lessonId }
    });

    if (existing) {
      return res.json(existing);
    }

    const progress = await prisma.progress.create({
      data: {
        userId,
        lessonId,
        completed: true,
        completedAt: new Date(),
        xpAwarded: 15
      }
    });

    res.json(progress);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
