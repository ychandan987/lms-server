import express from "express";
import {
  addQuiz,
  updateQuiz,
  deleteQuiz
} from "../Controller/quiz.controller.js";

const router = express.Router();

router.post("/", addQuiz);
router.put("/:id", updateQuiz);
router.delete("/:id", deleteQuiz);

export default router;
