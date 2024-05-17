import User from "../models/user.js";
import * as jwt from 'jsonwebtoken';

export const registerUser = async (req, res) => {
  try {
    const { name, colour } = req.body;
    if (!name || !colour) {
      return res.status(400).json({ errorMessage: "Bad request" });
    }

    const isExistingUser = await User.findOne({ name: name });

    if (isExistingUser) {
      return res.status(409).json({ message: "User alreday exist" });
    }

    res.json({ message: "User register success" });

    const userData = new User({
      name,
      colour,
    });

    await userData.save();
  } catch (e) {
    console.log(e);
    res.status(500).json({ errorMessage: "Something went wrong!" });
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const { name, colour } = req.body;

    if (!name || !colour) {
      return res.status(400).json({
        errorMessage: "Bad request",
      });
    }
    const userDetails = await User.findOne({ name: name });
    if (!userDetails) {
        return res
            .status(409)
            .json({ errorMessage: "User doesn't exists" });
    }

    const token = jwt.default.sign(
        { userId: userDetails._id },
        process.env.SECRET_KEY,
    )

    res.json({
      message: "User logged in",
      token: token,
      userId: userDetails._id,
      name: userDetails.name,
    });

  } catch (e) {
    console.log(e);
    res.status(500).json({ errorMessage: "Something went wrong!" });
  }
};

export const getAllUser = async (req, res) => {
  try {
    const userData = await User.find();
    res.json(userData);
  } catch (e) {
    console.log(e);
    res.status(500).json({ errorMessage: "Something went wrong!" });
  }
};
