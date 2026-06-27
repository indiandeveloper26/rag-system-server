import mongoose from "mongoose";

const enrollmentSchema = new mongoose.Schema({
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
        enum: ["pending", "paid", "cancelled"],
        default: "paid"
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

}, {
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

const Enrollment = mongoose.model("Enrollment", enrollmentSchema);
export default Enrollment