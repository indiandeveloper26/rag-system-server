import Course from "../models/Course.js";

export const getAllCourses = async (req, res) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = 5;

        const totalCourses = await Course.countDocuments();

        const courses = await Course.find({})

            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit);

        res.status(200).json({
            success: true,
            courses,
            currentPage: page,
            totalCourses,
            hasMore: page * limit < totalCourses,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};