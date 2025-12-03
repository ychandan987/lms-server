import prisma from "../DB/db.config.js";

export const uploadThumbnail = async (req, res) => {
  try {
    const { courseId, base64 } = req.body;

    const course = await prisma.course.update({
      where: { id: courseId },
      data: { thumbnail: base64 }
    });

    res.json(course);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

export const uploadVideoUrl = async (req, res) => {
  try {
    const { lessonId, url } = req.body;

    const lesson = await prisma.lesson.update({
      where: { id: lessonId },
      data: { videoUrl: url }
    });

    res.json(lesson);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
