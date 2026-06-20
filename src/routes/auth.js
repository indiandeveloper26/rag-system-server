import express from "express";
import { googleLogin, logout } from "../controllers/auth.controller.js";


const router = express.Router();

router.post("/google", googleLogin);
router.post("/logout", logout);

export default router;