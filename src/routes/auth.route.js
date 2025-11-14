import express from "express";
import { register, login, logout } from "../controllers/auth.controller.js";
import { verifyEmail } from "../services/verifyEmail.service.js"

const router = express.Router();

router.post("/register", register);
router.get("/verify-email", verifyEmail);
router.post("/login", login);
router.post("/logout", logout);

export default router;