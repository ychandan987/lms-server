import prisma from "../DB/db.config.js";

export const createCourse = async (req, res) => {
  try {
    const course = await prisma.course.create({ data: req.body });
    res.json(course);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

export const getCourses = async (req, res) => {
  const courses = await prisma.course.findMany({
    include: { chapters: { include: { lessons: true } } }
  });
  res.json(courses);
};

export const getCourse = async (req, res) => {
  const course = await prisma.course.findUnique({
    where: { id: req.params.id },
    include: { chapters: { include: { lessons: true } } }
  });
  res.json(course);
};

export const updateCourse = async (req, res) => {
  const course = await prisma.course.update({
    where: { id: req.params.id },
    data: req.body
  });
  res.json(course);
};

export const deleteCourse = async (req, res) => {
  await prisma.course.delete({ where: { id: req.params.id } });
  res.json({ success: true });
};

export const publishCourse = async (req, res) => {
  const course = await prisma.course.update({
    where: { id: req.params.id },
    data: { published: true }
  });
  res.json(course);
};

export const unpublishCourse = async (req, res) => {
  const course = await prisma.course.update({
    where: { id: req.params.id },
    data: { published: false }
  });
  res.json(course);
};

export const duplicateCourse = async (req, res) => {
  const oldCourse = await prisma.course.findUnique({
    where: { id: req.params.id },
    include: { chapters: { include: { lessons: { include: { quiz: true } } } } }
  });

  const newCourse = await prisma.course.create({
    data: {
      title: oldCourse.title + " (Copy)",
      description: oldCourse.description,
      thumbnail: oldCourse.thumbnail,
      certificateAvailable: oldCourse.certificateAvailable,
      chapters: {
        create: oldCourse.chapters.map((ch) => ({
          title: ch.title,
          lessons: {
            create: ch.lessons.map((l) => ({
              title: l.title,
              content: l.content,
              videoUrl: l.videoUrl,
              duration: l.duration,
              quiz: l.quiz
                ? {
                    create: {
                      question: l.quiz.question,
                      answerIndex: l.quiz.answerIndex,
                      options: l.quiz.options
                    }
                  }
                : undefined
            }))
          }
        }))
      }
    }
  });

  res.json(newCourse);
};
