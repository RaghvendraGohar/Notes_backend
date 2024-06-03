import QuestionAnswer from "../models/questionAnswer.js";
import Quiz from "../models/quiz.js";

export const createQuestion = async (req, res) => {
  const { question, options, quizRefId, quizType } = req.body;
  const isQuizCreated = await Quiz.findById(quizRefId);
  if (!isQuizCreated) {
    return res.status(409).json({ message: "Quiz Not Exits" });
  }

  const isExistingQuestion = await QuestionAnswer.findOne({
    question: question,
    quizRefId: quizRefId,
  });
  if (isExistingQuestion) {
    return res.status(409).json({ message: "Quiz Question alreday exist" });
  }

  let questionAnswerData;
  if (quizType == "Q/A") {
    const { question, correctAnswerOption, options, quizRefId } = req.body;
    if (!question || !correctAnswerOption || !options || !quizRefId) {
      return res.status(400).json({ errorMessage: "Bad request here" });
    }

    questionAnswerData = new QuestionAnswer({
      quizRefId: quizRefId,
      options: options,
      correctAnswerOption: correctAnswerOption,
      question: question,
      totalAttempted: 0,
      toalCorrected: 0,
    });
  } else if (quizType == "POLL" || quizType === "Poll") {
    questionAnswerData = new QuestionAnswer({
      quizRefId: quizRefId,
      options: options,
      question: question,
    });
  } else {
    res.status(500).json({ errorMessage: "Not a valid type" });
  }

  try {
    await questionAnswerData.save();
    res.json({ message: "Question Created Created success" });
  } catch (e) {
    console.log(e);
    res.status(500).json({ errorMessage: "Something went wrong!" });
  }
};

export const listQuestion = async (req, res) => {
  const { listQuestion, quizType } = req.body.quizData;

  try {
    let questionAnswerData;
    if (quizType === "Q/A") {
      const questionAnswerDto = await Promise.all(
        listQuestion.map(async (questionData) => {
          const { quizRefId, question, correctAnswerOption, options, timer } =
            questionData;
          if (!question || !options || !quizRefId || !correctAnswerOption) {
            throw new Error("Bad request hereeeeeeeeeeeeeeeeeeeeeeeeeeee");
          }

          questionAnswerData = new QuestionAnswer({
            quizRefId: quizRefId,
            options: options,
            correctAnswerOption: correctAnswerOption%4,
            question: question,
            totalAttempted: 0,
            totalCorrected: 0,
            timer: timer
          });
          await questionAnswerData.save();
        })
      );
    } else if (quizType === "POLL" || quizType === "Poll") {
      const questionAnswerDto = await Promise.all(
        listQuestion.map(async (questionData) => {
          const { quizRefId, question, options, timer } = questionData;
          if (!question || !options || !quizRefId 
            // || !timer
          ) {
            throw new Error("Bad request hereeeeeeeeeee");
          }
          questionAnswerData = new QuestionAnswer({
            quizRefId: quizRefId,
            options: options,
            question: question,
            timer: timer
          });
          await questionAnswerData.save();
        })
      );
    } else {
      return res.status(500).json({ errorMessage: "Not a valid type" });
    }
    res.json({
      message: "List of questions created successfully",
    });
  } catch (error) {
    console.error(error);
    if (error.message === "Bad request here") {
      return res.status(400).json({ errorMessage: error.message });
    }
    res
      .status(500)
      .json({ errorMessage: "An error occurred while saving questions" });
}
};

export const submitQuiz = async (req, res) => {
  const { listQuestion, quizType } = req.body.quizData;

  if (!quizType) {
    return res.status(400).json({ errorMessage: "quizType is undefined" });
  }

  try {
    if (quizType === "Q/A") {
      await Promise.all(
        listQuestion.map(async (questionData) => {
          const { id, isCorrected } = questionData;
          const questionAnswer = await QuestionAnswer.findById(id);
          let totalCorrected1 = questionAnswer.totalCorrected;
    
          if (isCorrected) {
            totalCorrected1 += 1;
          }
          await QuestionAnswer.updateOne(
            { _id: id },
            {
              $set: {
                totalAttempted: questionAnswer.totalAttempted + 1,
                totalCorrected: totalCorrected1,
              },
            }
          );
        })
      );
    } else if (quizType === "POLL" || quizType === "Poll") {
      await Promise.all(
        listQuestion.map(async (questionData) => {
          const { id, optionSelected } = questionData;
          const questionAnswer = await QuestionAnswer.findById(id);
          let totalCorrected = questionAnswer.selectedOption[optionSelected].count + 1;
          await QuestionAnswer.updateOne(
            { _id: id },
            { $set: { [`selectedOption.${optionSelected}.count`]: totalCorrected } }
          );
        })
      );
    } else {
      return res.status(500).json({ errorMessage: "Not a valid type" });
    }
    res.json({
      message: "List of questions created successfully",
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ errorMessage: "An error occurred while saving questions" });
  }
};
