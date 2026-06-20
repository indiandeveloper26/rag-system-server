import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

import ragrouter from "./routes/rag-auth.js";
import router from "./routes/auth.js";
import connectDB from "./confing/db.js";


dotenv.config();

const app = express();


// CORS FIRST
app.use(
    cors({
        origin: "http://localhost:3000",
        credentials: true,
    })
);


app.use(express.json());

app.use(cookieParser());


// MongoDB
connectDB();


// Routes

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Server Running v.2 🚀"
    });
});


app.use("/auth", router);

app.use("/rag", ragrouter);


export default app;