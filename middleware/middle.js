import * as jwt from "jsonwebtoken";

export const middle = (req, res, next) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).json({ message: "Unauthorized access" });
    }
    const decode = jwt.default.verify(token, process.env.SECRET_KEY);
    console.log(decode)
    req.currentId = decode.userId;
    next();
  } catch (e) {
    return res.status(401).json({
      message: "middle ware error",
    });
  }
};
