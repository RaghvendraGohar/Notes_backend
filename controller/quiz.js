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

export const playQuiz = async (req, res) => {
  try {
    const link = req.query.link;
    if (!link) {
      return res.status(400).json({ error: 'Link parameter is required' });
    }

    const quiz = await Quiz.findOne({ link: link });
    if (!quiz) {
      console.error('Quiz not found for link:', link);
      return res.status(404).json({ error: 'Quiz not found' });
    }

    console.log(quiz)
    console.log('Quiz found:', quiz.id);
    const quizType =quiz.quizType;

    const questionAnswer = await QuestionAnswer.find({ quizRefId: quiz.id });
    res.json({questionAnswer,quizType});
  } catch (error) {
    console.error('Error in playQuiz:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteQuiz = async (req, res) => {
  try {
    const quizId = req.params.id;
    // Find the quiz by ID and check if it belongs to the current user
    const quiz = await Quiz.findOne({ _id: quizId});
    if (!quiz) {
      return res.status(404).json({ errorMessage: "Quiz not found" });
    }

    // Delete the quiz
    await Quiz.deleteOne({ _id: quizId });

    // Optionally, delete associated question answers
    await QuestionAnswer.deleteMany({ quizRefId: quizId });

    res.status(200).json({ message: "Quiz deleted successfully" });
  } catch (error) {
    console.error('Error in deleteQuiz:', error);
    res.status(500).json({ errorMessage: "Internal server error" });
  }
};


export const updateQuizImpression = async (req, res) => {
  try {
    const quizId = req.params.id;

    // Find the quiz by ID
    const quiz = await Quiz.findOne({ _id: quizId });
    if (!quiz) {
      return res.status(404).json({ errorMessage: "Quiz not found" });
    }

    // Increment the impression count
    quiz.impression += 1;

    // Save the updated quiz
    const updatedQuiz = await quiz.save();

    res.status(200).json({ message: "Impression updated successfully", updatedQuiz });
  } catch (error) {
    console.error('Error in updateQuizImpression:', error);
    res.status(500).json({ errorMessage: "Internal server error" });
  }
};

