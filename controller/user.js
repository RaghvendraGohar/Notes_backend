import User from "../models/user.js";
import * as jwt from 'jsonwebtoken';
import bcrypt from "bcrypt";
import Quiz from "../models/quiz.js";
import { mapQuizToQuizDto } from "./quiz.js";

export const registerUser = async (req, res) => {
  try {
    const { name, email,password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ errorMessage: "Bad request" });
    }

    const isExistingUser = await User.findOne({ email: email });

    if (isExistingUser) {
      return res.status(409).json({ message: "User alreday exist" });
    }

   const hashedPassword = await bcrypt.hash(password,10)

    const userData = new User({
      name,
      email,
      password : hashedPassword,
    });

    await userData.save();
    res.json({ message: "User register success" });
  } catch (e) {
    console.log(e);
    res.status(500).json({ errorMessage: "Something went wrong!" });
  }
};

export const loginUser = async (req, res,) => {
  try {
    const {  password, email } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        errorMessage: "Bad request",
      });
    }
    const userDetails = await User.findOne({ email: email});
    if (!userDetails) {
        return res
            .status(409)
            .json({ errorMessage: "User doesn't exists" });
    }

    const isPasswordMatched = await bcrypt.compare(
      password,
      userDetails.password
    )

    if (!isPasswordMatched) {
      return res
          .status(401)
          .json({ errorMessage: "Invalid credentials" });
  }

    const token = jwt.default.sign(
        { userId: userDetails._id ,
         userName: userDetails.name },
        "123abcd",
        { expiresIn: "48h" }
    )

    const quizzes = await Quiz.find({ refUserId: userDetails._id });


      // Map each Quiz instance to QuizDto instance
      const quizDtos = await Promise.all(quizzes.map(mapQuizToQuizDto));

      res.json(
        {quizDto: quizDtos,
        token: token,
        name:userDetails.name,
        userId:userDetails._id,
        })


  } catch (e) {
    console.log(e);
    res.status(500).json({ errorMessage: "Something went wrong!" });
  }
};

