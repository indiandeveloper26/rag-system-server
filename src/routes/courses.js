import express from "express";


import { uploadCourse } from "../controllers/courses.js";
import { getAllCourses } from "../controllers/get-courses.js";
import { getMyCourses } from "../controllers/getCourseById.js";
import { getSingleCourse } from "../controllers/selectcourse.js";




const router = express.Router();


router.post("/create", uploadCourse);
router.get("/get", getAllCourses);



router.get("/get/:id", getMyCourses);

router.get("/select/:id", getSingleCourse);

export default router;