import express from "express";


import { uploadCourse } from "../controllers/courses.js";
import { getAllCourses } from "../controllers/get-courses.js";
import { getMyCourses } from "../controllers/getCourseById.js";




const router = express.Router();


router.post("/create", uploadCourse);
router.get("/get", getAllCourses);



router.get("/get/:id", getMyCourses);

export default router;