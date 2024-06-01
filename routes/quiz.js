import express from "express";
import { createQuiz, getAllQuizById ,playQuiz} from "../controller/quiz.js";
import { verifyToken } from "../middleware/middle.js";
const router = express.Router();

router.post("/create-quiz",verifyToken,createQuiz)
router.get("/all-quiz",verifyToken,getAllQuizById)
router.get("/play",playQuiz)


export default router;