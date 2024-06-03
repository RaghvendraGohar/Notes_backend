import mongoose from "mongoose";

const answerSchema = new mongoose.Schema({
    text: String,
    image: String,
});

const seletedAnswerSchema = new mongoose.Schema({
    option: {
        type: Number,
    }, 
    count: {
        type: Number,
        default: 0,
    }
});

const questionAnswerSchema = new mongoose.Schema({
    quizRefId :{
        type : String,
        required : true,
    },
    question :{
        type : String,
        required : true,
        
    },
    correctAnswerOption :{
        type : Number,
    },
    options : {
        type: [answerSchema],
        required: true,
    },
    totalAttempted :{
        type : Number,
    },
    totalCorrected :{
        type : Number,
    },
    selectedOption: {
        type: [seletedAnswerSchema],
    },
    timer :{
        type: Number,
        required : false,
        default : 0
    }
},{timestamps:{createdAt:"createdAt" , updatedAt: "updatedAt"}})

const QuestionAnswer = mongoose.model("QuestionAnswer",questionAnswerSchema);

export default QuestionAnswer;