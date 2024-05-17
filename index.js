import express from "express";
import mongoose from "mongoose";
import authRoutes from "./routes/auth.js";
import notehRoutes from "./routes/note.js";
import dotenv from "dotenv"
import cors from 'cors';

const app = express();
const PORT = 4152;
dotenv.config();
app.use(cors());

app.use(express.json());
// ---------------------------------------------------------------------

app.get('/health',(req,res)=>{
    console.log("health api");
    res.json({
        service:"Backed notes app",
        status:"active",
        time:new Date(),
    })
});

app.use("/api/v1/auth",authRoutes);
app.use("/api/v1/note",notehRoutes);




// ----------------------------------------------------------------
mongoose
.connect(process.env.MONGODB_URI)
.then(()=>{console.log("Db connected")})
.catch((e)=>{console.log("Db failed to connect :",e)})

app.listen(PORT,()=>{
    console.log(`backendend running on ${PORT}`)
});