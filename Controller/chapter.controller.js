import prisma from "../DB/db.config.js";

export const createChapter = async (req, res) => {
  try {
    const { courseId, title } = req.body;

    const chapter = await prisma.chapter.create({
      data: { title, courseId }
    });

    res.json(chapter);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

export const updateChapter = async (req, res) => {
  try {
    const chapter = await prisma.chapter.update({
      where: { id: req.params.id },
      data: req.body
    });

    res.json(chapter);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

export const deleteChapter = async (req, res) => {
  try {
    await prisma.chapter.delete({
      where: { id: req.params.id }
    });

    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
