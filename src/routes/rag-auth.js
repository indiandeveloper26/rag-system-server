import express from "express";

import { Raguplaod } from "../controllers/upload-controller.js";
import { ragController } from "../controllers/rag-controller.js";




const ragrouter = express.Router();


ragrouter.post("/ask", ragController);
ragrouter.post("/upload", Raguplaod);

export default ragrouter;