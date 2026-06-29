import mongoose from "mongoose";

const enrollmentSchema = new mongoose.Schema(
    {
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Aiselleruser",
            required: true
        },

        course: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course",
            required: true
        },

        paymentId: String,

        amount: Number,

        status: {
            type: String,
            enum: ["pending", "paid", "cancelled", "refunded"],
            default: "paid"
        },

        // ✅ User ne course kab buy kiya
        purchasedAt: {
            type: Date,
            default: Date.now
        },

        // ✅ Refund last date (7 days)
        refundExpiry: {
            type: Date,
            default: function () {
                return new Date(
                    Date.now() + 7 * 24 * 60 * 60 * 1000
                );
            }
        },

        // ✅ Refund hua ya nahi
        refunded: {
            type: Boolean,
            default: false
        },

        // ✅ Refund kab hua
        refundedAt: {
            type: Date,
            default: null
        },

        progress: {
            type: Number,
            default: 0
        },

        completedLessons: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Lesson"
        }],

        completed: {
            type: Boolean,
            default: false
        }

    },
    {
        timestamps: true
    });

enrollmentSchema.index(
    {
        student: 1,
        course: 1
    },
    {
        unique: true
    }
);

const Enrollment =
    mongoose.models.Enrollment ||
    mongoose.model("Enrollment", enrollmentSchema);

export default Enrollment;