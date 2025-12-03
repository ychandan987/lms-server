import prisma from "../DB/db.config.js";

export const addQuiz = async (req, res) => {
  try {
    const { lessonId, question, options, answerIndex } = req.body;

    const quiz = await prisma.quiz.create({
      data: {
        lessonId,
        question,
        options,
        answerIndex
      }
    });

    res.json(quiz);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

export const updateQuiz = async (req, res) => {
  try {
    const quiz = await prisma.quiz.update({
      where: { id: req.params.id },
      data: req.body
    });

    res.json(quiz);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

export const deleteQuiz = async (req, res) => {
  try {
    await prisma.quiz.delete({
      where: { id: req.params.id }
    });

    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
