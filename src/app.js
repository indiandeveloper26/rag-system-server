import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

dotenv.config();

import ragrouter from "./routes/rag-auth.js";
import router from "./routes/auth.js";
import payment from "./routes/paymentRoutes.js"
import refund from "./routes/refund.js"




import connectDB from "./confing/db.js";
import coursecrate from "./routes/courses.js"

import Enrollment from "./models/Enrollment.js";
import Course from "./models/Course.js";
import User from "./models/user.js";




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
        message: "Server Running  v- 1.2.2 🚀"
    });
});


app.use("/auth", router);
app.use("/courses/", coursecrate);
app.use("/payment/", payment);

app.use("/refund/", refund);

app.use("/rag", ragrouter);
















app.get("/api", async (req, res) => {
    try {

        let data = await Enrollment.find()


        res.json({ 'data': data })

    } catch (error) {
        res.send("error")
    }
})


















export default app;