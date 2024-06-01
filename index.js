import express from "express";
import mongoose from "mongoose";
import authRoutes from "./routes/auth.js";
import quizRoutes from "./routes/quiz.js";
import questionAnswerRoutes from "./routes/questionAnswer.js"
import dotenv from "dotenv"
import cors from 'cors';

const app = express();
const PORT = 8000;
dotenv.config();
app.use(cors());

app.use(express.json());
// ---------------------------------------------------------------------

app.get('/health',(req,res)=>{
    console.log("health api");
    res.json({
        service:"Backed app",
        status:"active",
        time:new Date(),
    })
});

app.use("/api/v1/auth",authRoutes);
app.use("/api/v1/quiz",quizRoutes);
app.use("/api/v1/question",questionAnswerRoutes);

// ----------------------------------------------------------------
mongoose
.connect("mongodb+srv://raghv:123123123@cluster0.mbasgwh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
.then(()=>{console.log("Db connected")})
.catch((e)=>{console.log("Db failed to connect :",e)})

app.listen(PORT,()=>{
    console.log(`backendend running on ${PORT}`)
});