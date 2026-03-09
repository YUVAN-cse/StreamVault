import jwt from "jsonwebtoken";
import AppError from "../utils/ErrorClass.js";

export const requestUser = (req, res, next) => {
    const { accessToken } = req.cookies;
    
    if (!accessToken) {
        return next(new AppError(401, 'Unauthorized'));
    }
    try {
        req.user = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET);
        next();
    } catch (err) {
        return next(new AppError(401, 'Invalid token'));
    }
};


export default function authVerify(Schema) {
    return (req, res, next) => {
        let data = { ...req.body };
        if (req.files) {
            data.avatar = req.files.avatar;
            data.coverImage = req.files.coverImage;
        }
        const { error } = Schema.validate(data);
        if (error) {
            return next(new AppError(400, error.details[0].message));
        }
        next();
    };
}