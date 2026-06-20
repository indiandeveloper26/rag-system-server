import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
    {
        studentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },

        courseId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course",
        },

        rating: Number,

        review: String,
    },
    { timestamps: true }
);

export default mongoose.model(
    "Review",
    reviewSchema
);