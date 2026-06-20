import mongoose from "mongoose";

const refundSchema = new mongoose.Schema(
    {
        orderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Order",
        },

        studentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },

        courseId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course",
        },

        reason: String,

        status: {
            type: String,
            enum: [
                "pending",
                "ai_approved",
                "ai_rejected",
                "admin_approved",
                "admin_rejected",
            ],
            default: "pending",
        },

        aiDecision: {
            score: Number,
            recommendation: String,
            explanation: String,
        },

        adminDecision: {
            reviewedBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },

            comment: String,

            reviewedAt: Date,
        },
    },
    { timestamps: true }
);

export default mongoose.model(
    "Refund",
    refundSchema
);