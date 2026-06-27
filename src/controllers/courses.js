import Course from "../models/Course.js"; // Aapke model ka sahi path

export const uploadCourse = async (req, res) => {
    try {
        // 1. req.body se saari fields ke saath 'userId' bhi nikaal li
        const {
            title,
            description,
            category,
            level,
            price,
            language,
            totalLessons,
            totalDuration,
            liveVideoUrl,
            instructor // 👈 Yeh rhi tumhari userId jo body se aa rahi hai
        } = req.body;

        // 2. Validation: Ab userId ko bhi check karenge ki woh aayi hai ya nahi
        if (!title || !description || !category || price === undefined || !instructor) {
            return res.status(400).json({
                success: false,
                message: "Title, description, category, price, and userId are required."
            });
        }

        // 3. New Course Object banaya
        const newCourse = new Course({
            title,
            description,
            liveVideoUrl: liveVideoUrl || "",
            category,
            level,
            instructor: instructor, // 👈 req.body waali userId yahan map ho gayi
            price,
            language,
            totalLessons,
            totalDuration
        });

        // 4. Database me course save kiya
        const savedCourse = await newCourse.save();

        // 5. Save hote hi us userId (instructor) ka saara data fetch kiya
        const fullCourseDetails = await Course.findById(savedCourse._id)
            .populate("instructor", "name email profilePic role"); // Jo details user collection se chahiye woh yahan likho

        // 6. Response send kiya poore user data ke saath
        return res.status(201).json({
            success: true,
            message: "Course uploaded successfully!",
            data: fullCourseDetails
        });

    } catch (error) {
        console.error("Upload Course Error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        });
    }
};