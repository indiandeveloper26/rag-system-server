import express from "express";
import { ragController } from "./controllersr.js";
import { setupRAG } from "../pdfsave.js";



const ragrouter = express.Router();


ragrouter.post("/ask", ragController);
ragrouter.post("/", setupRAG);

export default ragrouter;