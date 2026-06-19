


















import express from "express";
import cors from "cors";
import ragrouter from "./src/routers.js";
import dotenv from "dotenv";



dotenv.config();


const app = express();
app.use(cors());
app.use(express.json());

// Routes link karein
app.use("/ai", ragrouter);


console.log('env', process.env.GOOGLE_API_KEY)


app.get("/", (Req, res) => {
  res.json({ 'server': "runinggg" })
})


//rag()



const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`👉 Test API at: http://localhost:5000/api/rag/askee`);
});