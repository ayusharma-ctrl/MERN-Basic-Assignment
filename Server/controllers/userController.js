import bcrypt from 'bcrypt'

// file-imports
import { userModel } from "../models/userModel.js";
import { cleanupAndValidateRegister } from "../utils/cleanupAndValidate.js";
import { sendCookie } from '../utils/sendCookie.js';


// func to register a new user
export const userRegister = async (req, res) => {

    let { name, email, password, confirmPassword } = req.body

    name = name?.trim();
    email = email?.trim();
    password = password?.trim();
    confirmPassword = confirmPassword?.trim();

    try {
        await cleanupAndValidateRegister({ name, email, password, confirmPassword });
    } catch (err) {
        return res.send({
            status: 400,
            success: false,
            message: err,
        })
    }

    // check for unique email 
    const userObjByEmail = await userModel.findOne({ email: email })
    if (userObjByEmail) {
        return res.send({
            status: 400,
            success: false,
            message: "This email is already registered. Either login or use a unique email to create a new account."
        })
    }

    try {
        // password hashing to store it in Database
        const hashedPassword = await bcrypt.hash(password, parseInt(process.env.SALTROUNDS))
        // saving user information in database
        const user = await userModel.create({
            name: name,
            email: email,
            password: hashedPassword
        })
        await user.save();
        // sending token
        sendCookie(user, res, "Registered Succesfully!", 201)
    } catch (err) {
        console.log(err)
        return res.send({
            status: 500,
            success: false,
            message: "Internal Server Error!",
            error: err
        })
    }
}

// func to login
export const userLogin = async (req, res) => {
    let { username, password } = req.body
    username = username?.trim();
    password = password?.trim();

    if (!username || !password || username.length < 3 || password.length < 6) {
        return res.send({
            status: 400,
            success: false,
            message: "Invalid Credentials!"
        })
    }

    const user = await userModel.findOne({ email: username })

    if (!user) {
        return res.send({
            status:404,
            success: false,
            message: "User not found! Please enter valid credentials or create a new account."
        })
    }

    // checking if password is valid or not
    const isPasswordCorrect = await bcrypt.compare(password, user.password)

    if (!isPasswordCorrect) {
        return res.send({
            status:400,
            success: false,
            message: "Username or Password is invalid!"
        })
    }

    // everything is 'ok', let the user login
    try {
        sendCookie(user, res, `Welcome back ${user.name}!`, 200)
    } catch (error) {
        return res.send({
            status:500,
            success: false,
            message: "Login Failed! Internal server error!",
            error: error,
        });
    }
}

// func to logout
export const logout = (req, res) => {
    try {
        return res.status(200).cookie("token", "", {
            expires: new Date(Date.now()),
        }).json({
            success: true,
            message: "Logged Out!"
        })
    }
    catch (err) {
        console.log(err);
        return res.send({
            success: false,
            status: 500,
            message: "Internal Server Error!"
        })
    }
}

// func to get user profile
export const myProfile = async (req, res) => {
    try {
        // const { email } = req.user;
        // const user = await userModel.findOne({ email: email })
        return res.send({
            success: true,
            status: 200,
            message: "My Profile Details!",
            user: req.user
        })
    }
    catch (err) {
        console.log(err);
        return res.send({
            success: false,
            status: 500,
            message: "Internal Server Error!",
            error: err
        })
    }
}