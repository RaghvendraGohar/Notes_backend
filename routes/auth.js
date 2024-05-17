import express from "express";
import { registerUser } from "../controller/user.js";
import { loginUser } from "../controller/user.js";
import { getAllUser } from "../controller/user.js";

const router = express.Router();

router.post("/create",registerUser)
router.post("/select",loginUser)
router.get("/all",getAllUser)


export default router;