import { userModel } from "../models/userModel.js";
import jwt from "jsonwebtoken"

// func to check whether user is logged in or not
export const isAuthenticated = async (req, res, next) => {
    const { token } = req.cookies;
    try {
        // checking if token does exist in browser's cookie or not
        if (!token) {
            return res.send({
                success: false,
                status: 404,
                message: "Please login first!"
            })
        }
        // decoding the token to read it's values and fetch userID
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // saving the user information
        req.user = await userModel.findById(decoded._id);
        // callling the next func
        next();
    }
    catch (err) {
        console.log(err)
        return res.send({
            status: 500,
            success: false,
            message: "Internal Server Error!",
            error: err
        })
    }
}