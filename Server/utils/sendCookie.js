import jwt from 'jsonwebtoken'

// func to create a jwt token using userID and send a cookie to client's browser
export const sendCookie = (user, res, message, statusCode = 200) => {
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET)

    res.cookie("token", token, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
    }).send({
        success: true,
        message: message,
        status: statusCode,
        user: user
    })
}