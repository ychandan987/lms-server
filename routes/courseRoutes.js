import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
const router = express.Router();
router.use(express.json());

dotenv.config();

const app = express();
const prisma = new PrismaClient();
router.use(cors());
router.use(express.json());
router.use(express.urlencoded({ extended: true }));

// ----------------------
//   COURSE CRUD
// ----------------------

router.post("/courses", async (req, res) => {
  try {
    const course = await prisma.course.create({
      data: req.body,
    });
    res.json(course);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/courses", async (_, res) => {
  res.json(await prisma.course.findMany({ include: { chapters: true } }));
});

router.get("/courses/:id", async (req, res) => {
  const id = Number(req.params.id);
  res.json(
    await prisma.course.findUnique({
      where: { id },
      include: {
        chapters: true,
        attachments: true,
      },
    })
  );
});

router.put("/courses/:id", async (req, res) => {
  const id = Number(req.params.id);
  res.json(await prisma.course.update({ where: { id }, data: req.body }));
});

router.delete("/courses/:id", async (req, res) => {
  const id = Number(req.params.id);
  await prisma.course.delete({ where: { id } });
  res.json({ message: "Course deleted" });
});

// ----------------------
//   CHAPTER CRUD
// ----------------------

router.post("/chapters", async (req, res) => {
  try {
    const chapter = await prisma.chapter.create({
      data: req.body,
    });
    res.json(chapter);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/chapters/:id", async (req, res) => {
  const id = Number(req.params.id);
  res.json(
    await prisma.chapter.findUnique({
      where: { id },
      include: {
        tests: true,
        assignments: true,
      },
    })
  );
});

router.put("/chapters/:id", async (req, res) => {
  const id = Number(req.params.id);
  res.json(
    await prisma.chapter.update({
      where: { id },
      data: req.body,
    })
  );
});

router.delete("/chapters/:id", async (req, res) => {
  const id = Number(req.params.id);
  await prisma.chapter.delete({ where: { id } });
  res.json({ message: "Chapter deleted" });
});

// ----------------------
//   ASSIGNMENTS
// ----------------------

router.post("/assignments", async (req, res) => {
  res.json(await prisma.assignment.create({ data: req.body }));
});

// ----------------------
//   ATTACHMENTS
// ----------------------

router.post("/attachments", async (req, res) => {
  res.json(await prisma.attachment.create({ data: req.body }));
});

// ----------------------
//   TEST BUILDER
// ----------------------

router.post("/tests", async (req, res) => {
  try {
    const test = await prisma.test.create({
      data: req.body,
    });

    res.json(test);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;


//
// ➤ Create Course (React):
// await axios.post("/courses", {
//   title: course.title,
//   description: course.description,
//   price: course.price,
//   image_url: course.image_url,
//   category: course.category,
//   status: "DRAFT"
// });

// ➤ Add Chapter:
// await axios.post("/chapters", {
//   title: chapter.title,
//   description: chapter.description,
//   video_url: chapter.video_url,
//   is_free_preview: chapter.is_free_preview,
//   status: chapter.status,
//   courseId: course.id
// });

// ➤ Add MCQ Test:
// await axios.post("/tests", {
//   type: "mcq",
//   question: "What is React?",
//   options: ["Library", "Framework"],
//   answerIndex: 0,
//   chapterId
// });

// ➤ Add Match Test:
// await axios.post("/tests", {
//   type: "match",
//   question: "Match Fruits & Colors",
//   pairs: [
//     { left: "Apple", right: "Red" },
//     { left: "Banana", right: "Yellow" }
//   ],
//   chapterId
// });