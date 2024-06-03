import express from "express";
import { createQuiz, deleteQuiz, getAllQuizById ,playQuiz, updateQuizImpression} from "../controller/quiz.js";
import { verifyToken } from "../middleware/middle.js";
const router = express.Router();

router.post("/create-quiz",verifyToken,createQuiz)
router.get("/all-quiz",verifyToken,getAllQuizById)
router.get("/play",playQuiz)
router.delete("/delete/:id",deleteQuiz)
router.patch("/impression/:id",updateQuizImpression)


export default router;