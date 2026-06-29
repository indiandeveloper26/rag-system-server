import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Course title is required"],
            trim: true
        },
        description: {
            type: String,
            required: [true, "Course description is required"]
        },
        liveVideoUrl: {
            type: String,
            default: ""
        },
        refundExpiry: {
            type: Date,
            default: function () {
                return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
            },
        },
        category: {
            type: String,
            required: [true, "Category is required"]
        },
        level: {
            type: String,
            enum: ["beginner", "intermediate", "advanced"],
            default: "beginner"
        },

        // 🔑 Yeh field track karegi ki kis User (Instructor) ne course upload kiya hai
        instructor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Aiselleruser", // Aapke User model ka jo bhi naam ho (e.g., "User" ya "Instructor")
            required: [true, "Instructor UserID is required to upload a course"]
        },

        price: {
            type: Number,
            required: [true, "Price is required"],
            default: 0
        },
        language: {
            type: String,
            default: "English"
        },
        totalLessons: {
            type: Number,
            default: 0
        },
        totalDuration: {
            type: Number, // In minutes or hours
            default: 0
        },
        instructorname: {
            type: String
        },
        rating: {
            type: Number,
            default: 0
        },
        totalStudents: {
            type: Number,
            default: 0
        },
        status: {
            type: String,
            enum: ["pending", "approved", "rejected"],
            default: "pending"
        }
    },
    {
        timestamps: true // Isse createdAt aur updatedAt automatic mil jayega
    }
);

// Next.js ke hot-reloading crash se bachne ke liye standard check
const Course = mongoose.models.Course || mongoose.model("Course", courseSchema);

export default Course;