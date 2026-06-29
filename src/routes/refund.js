import express from "express";
import { refund } from "../controllers/refund.js";

const router = express.Router();

router.post("/ai", refund);


export default router;