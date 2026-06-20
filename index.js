


import dotenv from "dotenv";
import app from "./src/app.js";


dotenv.config();


console.log('dnd', process.env.MONGODB_URI)

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});