import Quiz from '../models/quiz.js';
import QuizDto from '../models/quizDto.js';
import QuestionAnswer from '../models/questionAnswer.js'

export const createQuiz = async (req, res) => {
  try {
    const currentUserId = req.currentUserId;
    const currentUserName = req.currentUserName;

    const { quizName, quizType } = req.body;
    if (!quizName || !quizType) {
      return res.status(400).json({ errorMessage: "Bad request" });
    }

    const isExistingQuiz = await Quiz.findOne({ 
        quizName: quizName, 
        refUserId: currentUserId 
    });
    
    if (isExistingQuiz) {
      return res.status(409).json({ message: "Quiz name alreday exist" });
    }
    const shortenedUserId = currentUserId.substring(0, 4);
    const link = `${currentUserName}-${shortenedUserId}-${quizName}`;

    const quizData = new Quiz({
        quizName,
        quizType,
        refUserId: currentUserId,
        link: link

    });

    const quizDataModel = await quizData.save();
    res.json({ quizDataModel });
  } catch (e) {
    console.log(e);
    res.status(500).json({ errorMessage: "Something went wrong!" });
  }
};

export async function mapQuizToQuizDto(quiz) {
  try {
      // Get the total number of questions for the quiz
      const totalQuestion = await QuestionAnswer.countDocuments({ quizRefId: quiz._id });

      // Create a new QuizDto instance with the mapped fields
      return new QuizDto({
          quizName: quiz.quizName,
          quizType: quiz.quizType,
          impression: quiz.impression,
          question: totalQuestion,
          link: quiz.link,
          createdAt: quiz.createdAt, // Copy createdAt from Quiz to QuizDto
          timer : quiz.timer
      });
  } catch (error) {
      throw new Error(`Error mapping quiz to quizDto: ${error.message}`);
  }
}

// Function to get all quizzes by user ID
export const getAllQuizById = async (req, res) => {
  try {
      const currentUserId = req.currentUserId;

      // Find all quizzes associated with the current user
      const quizzes = await Quiz.find({ refUserId: currentUserId });

      // Map each Quiz instance to QuizDto instance
      const quizDtos = await Promise.all(quizzes.map(mapQuizToQuizDto));

      res.json(quizDtos);
  } catch (error) {
      console.log(error);
      res.status(500).json({ errorMessage: "Something went wrong at get!" });
  }
};

export const playQuiz = async(req,res) => {
  const link = req.body.link
  const quiz = await Quiz.findOne({link:link})
  const questionAnswer = await QuestionAnswer.find({ quizRefId:quiz[0].id})
  res.json(questionAnswer)
}
