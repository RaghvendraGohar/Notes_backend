import mongoose from "mongoose";

const quizDtoSchema = new mongoose.Schema({
    quizName :{
        type : String,
        required : true,
    },
    quizType :{
        type : String,
        required : true,
        
    },
    impression :{
        type : Number,
        required : true,
        default:0,
    },
    question :{
        type : Number,
        required : true,
        default:0,
    },
    link :{
        type : String,
        required : true,
        unique:true,
    },
},{timestamps:{createdAt:"createdAt"}})

const QuizDto = mongoose.model("QuizDto",quizDtoSchema);
export default QuizDto;