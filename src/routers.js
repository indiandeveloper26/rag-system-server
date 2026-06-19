import express from "express";
import { ragController } from "./controllers.js";
import { setupRAG } from "./controllers/pdfsave.js";



const ragrouter = express.Router();


ragrouter.post("/ask", ragController);
ragrouter.post("/", setupRAG);

export default ragrouter;