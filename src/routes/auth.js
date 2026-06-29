import express from "express";
import { googleLogin, logout } from "../controllers/auth.controller.js";
import { getAccountBalance } from "../controllers/getaccountbal.js";


const router = express.Router();

router.post("/google", googleLogin);
router.post("/logout", logout);
router.get("/getaccount/:id", getAccountBalance);

export default router;