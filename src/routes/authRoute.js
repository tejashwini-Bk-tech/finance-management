import { register, login } from "../controllers/authController.js";
import { Router } from "express";

export const router = new Router()

router.post("/register", register)
router.post("/login", login)