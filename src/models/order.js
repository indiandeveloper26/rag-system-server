import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
    {
        studentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },

        courseId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course",
        },

        amount: Number,

        paymentId: String,

        gateway: String,

        paymentStatus: {
            type: String,
            enum: [
                "pending",
                "success",
                "failed",
                "refunded",
            ],
        },
    },
    { timestamps: true }
);

export default mongoose.model(
    "Order",
    orderSchema
);