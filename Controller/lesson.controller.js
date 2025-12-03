import prisma from "../DB/db.config.js";

export const createLesson = async (req, res) => {
  try {
    const { chapterId, title, content, duration, videoUrl } = req.body;

    const lesson = await prisma.lesson.create({
      data: { chapterId, title, content, duration, videoUrl }
    });

    res.json(lesson);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

export const updateLesson = async (req, res) => {
  try {
    const lesson = await prisma.lesson.update({
      where: { id: req.params.id },
      data: req.body
    });

    res.json(lesson);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

export const deleteLesson = async (req, res) => {
  try {
    await prisma.lesson.delete({
      where: { id: req.params.id }
    });

    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
