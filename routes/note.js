import express from "express";
const router = express.Router();
import { createNotes } from "../controller/note.js";
import { getAllNotesById } from "../controller/note.js";
import { middle } from "../middleware/middle.js";

router.post("/make",middle,createNotes);
router.get("/all/:userId",getAllNotesById)


export default router;