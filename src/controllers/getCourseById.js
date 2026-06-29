import Enrollment from "../models/Enrollment.js";

export const getMyCourses = async (req, res) => {
    try {
        const { id } = req.params;

        console.log('apicalingg with id', id)

        if (!id) {
            return res.status(400).json({
                success: false,
                message: "User ID is required.",
            });
        }

        const enrollments = await Enrollment.find({
            student: id,
            status: "paid",
        })
            .populate({
                path: "course", // small c
            })
            .sort({ createdAt: -1 });



        console.log('atatat', enrollments)

        if (enrollments.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No purchased courses found.",
                courses: [],
            });
        }

        return res.status(200).json({
            success: true,
            totalCourses: enrollments.length,
            courses: enrollments,
        });

    } catch (error) {
        console.error("Get My Courses Error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message,
        });
    }
};