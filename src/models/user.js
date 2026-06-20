import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },

        email: {
            type: String,
            unique: true,
            required: true,
            lowercase: true,
        },

        password: {
            type: String,
            default: null,
        },

        googleId: {
            type: String,
            default: null,
        },

        avatar: String,

        provider: {
            type: String,
            enum: ["email", "google", "both"],
            default: "email",
        },

        role: {
            type: String,
            enum: ["student", "instructor", "admin"],
            default: "student",
        },

        isVerified: {
            type: Boolean,
            default: false,
        },

        totalSpent: {
            type: Number,
            default: 0,
        },

        totalEarned: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true }
);

const User = mongoose.model("Aiselleruser", userSchema);

export default User