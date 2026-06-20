import mongoose from "mongoose";

const enrollmentSchema = new mongoose.Schema(
    {
        studentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },

        courseId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course",
        },

        progress: {
            type: Number,
            default: 0,
        },

        completedLessons: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Lesson",
            },
        ],

        completed: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

export default mongoose.model(
    "Enrollment",
    enrollmentSchema
);