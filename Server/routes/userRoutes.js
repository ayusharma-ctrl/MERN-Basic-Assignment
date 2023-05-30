import express from 'express';

// file-imports
import { isAuthenticated } from '../middlewares/auth.js';
import { logout, myProfile, userLogin, userRegister } from '../controllers/userController.js';

// creating a router
const router = express.Router();

// api to create new user
router.post("/register", userRegister )

// api to login
router.post("/login", userLogin )

// api to logout
router.get("/logout", isAuthenticated, logout)

// api to get user profile data only if user is logged in
router.get("/me", isAuthenticated, myProfile )

export default router;