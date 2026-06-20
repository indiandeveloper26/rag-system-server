import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
    {
        title: String,

        description: String,

        thumbnail: String,

        category: String,

        level: {
            type: String,
            enum: [
                "beginner",
                "intermediate",
                "advanced",
            ],
        },

        instructor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },

        price: Number,

        language: String,

        totalLessons: Number,

        totalDuration: Number,

        rating: {
            type: Number,
            default: 0,
        },

        totalStudents: {
            type: Number,
            default: 0,
        },

        status: {
            type: String,
            enum: ["pending", "approved", "rejected"],
            default: "pending",
        },
    },
    { timestamps: true }
);

export default mongoose.model("Course", courseSchema);