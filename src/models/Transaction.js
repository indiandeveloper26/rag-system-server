import mongoose from "mongoose";

const transactionSchema =
    new mongoose.Schema(
        {
            orderId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Order",
            },

            buyerId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },

            instructorId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },

            amount: Number,

            platformFee: Number,

            instructorAmount: Number,

            status: {
                type: String,
                enum: [
                    "pending",
                    "completed",
                    "refunded",
                ],
            },
        },
        { timestamps: true }
    );

export default mongoose.model(
    "Transaction",
    transactionSchema
);