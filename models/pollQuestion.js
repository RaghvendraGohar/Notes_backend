import mongoose from "mongoose";

const answerSchema = new mongoose.Schema({
    option: Number,
    count: Number
});

const selectedAnswerSchema = new mongoose.Schema({
    text: String,
    image: String
});

const pollQuestionSchema = new mongoose.Schema({
    quizRefId :{
        type : String,
        required : true,
    },
    question :{
        type : String,
        required : true,
        
    },
    options : {
        type: [answerSchema],
        required: true,
    },
    selectedOption: {
        type: [selectedAnswerSchema],
    }
},{timestamps:{createdAt:"createdAt" , updatedAt: "updatedAt"}})

const PollQuestion = mongoose.model("PollQuestion",pollQuestionSchema);
export default PollQuestion;