import mongoose from "mongoose";

const quizSchema = new mongoose.Schema({
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
    refUserId :{
        type : String,
        required : true,
    },
    link :{
        type : String,
        required : true,
        unique:true,
    },
    
},{timestamps:{createdAt:"createdAt"}})

const Quiz = mongoose.model("Quiz",quizSchema);
export default Quiz;