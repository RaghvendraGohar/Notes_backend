import express from "express";
import { verifyToken } from "../middleware/middle.js";
import { createQuestion,listQuestion, submitQuiz } from "../controller/questionAnswer.js";
const router = express.Router();

router.post("/create-question",verifyToken,createQuestion)
router.post("/list-question",verifyToken,listQuestion)
router.post("/submit",submitQuiz)


export default router;