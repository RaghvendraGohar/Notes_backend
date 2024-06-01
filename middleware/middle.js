import * as jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
    try {
        const token = req.headers.authorization;

        if (!token) {
            return res.status(401).json({ message: "Unauthorized access" });
        }

        const decode = jwt.default.verify(token, "123abcd");
        // console.log(decode)
        req.currentUserId = decode.userId;
        req.currentUserName = decode.userName;
        next();
    } catch (error) {
        return res.status(401).json({
            message: "Unauthorized access! Invalid token",
            // isTokenInValid: true,
        });
    }
};

