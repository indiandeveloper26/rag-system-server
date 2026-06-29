import Razorpay from "razorpay";

import crypto from "crypto";
import Enrollment from "../models/Enrollment.js";
import Course from "../models/Course.js";
import User from "../models/user.js";


// Razorpay Instance banayein (Apni keys .env file me zaroor dalein)
const razorpay = new Razorpay({
    key_id: 'rzp_test_T6acFMA7nhT3y9',
    key_secret: '9My5zZsINeJnu3gBn5QrYSCd',
});


console.log("KEY_ID =", process.env.RAZORPAY_KEY_ID);
console.log("SECRET =", process.env.RAZORPAY_KEY_SECRET);







export const checkout = async (req, res) => {
    try {
        const { courseId } = req.body;

        console.log("courseId:", courseId);

        const course = await Course.findById(courseId);

        console.log("course:", course);

        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course nahi mila",
            });
        }

        const options = {
            amount: Number(course.price * 100),
            currency: "INR",
            receipt: `rcpt_${Date.now()}`,
        };

        console.log("options:", options);

        const order = await razorpay.orders.create(options);

        console.log("order:", order);

        res.status(200).json({
            success: true,
            order,
        });

    } catch (error) {
        console.error("Checkout Error:", error);

        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
// @desc    Verify Razorpay Payment Signature
// @route   POST /api/payment/verify


export const paymentVerification = async (req, res) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            courseId,
            userId,
        } = req.body;

        // Verify Signature
        const body = `${razorpay_order_id}|${razorpay_payment_id}`;

        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(body)
            .digest("hex");

        if (expectedSignature !== razorpay_signature) {
            return res.status(400).json({
                success: false,
                message: "Payment verification failed",
            });
        }

        // Find Course
        const course = await Course.findById(courseId);

        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found",
            });
        }

        // Find Buyer
        const student = await User.findById(userId);

        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student not found",
            });
        }

        // Find Instructor
        const instructor = await User.findById(course.instructor);

        if (!instructor) {
            return res.status(404).json({
                success: false,
                message: "Instructor not found",
            });
        }

        // Already enrolled?
        const alreadyEnrolled = await Enrollment.findOne({
            student: userId,
            course: courseId,
        });

        if (alreadyEnrolled) {
            return res.status(400).json({
                success: false,
                message: "Already enrolled",
            });
        }

        // Balance Check
        if (student.accountBalance < course.price) {
            return res.status(400).json({
                success: false,
                message: "Insufficient balance",
            });
        }

        // Create Enrollment
        const enrollment = await Enrollment.create({
            student: userId,
            course: courseId,
            paymentId: razorpay_payment_id,
            amount: course.price,
            status: "paid",
        });

        // Update Student Wallet
        student.accountBalance -= course.price;
        student.totalSpent += course.price;

        // Update Instructor Wallet
        instructor.accountBalance += course.price;
        instructor.totalEarned += course.price;

        // Save Both
        await student.save();
        await instructor.save();

        // Update Course
        course.totalStudents += 1;
        await course.save();

        console.log("========== PAYMENT SUCCESS ==========");
        console.log("Student:", student.name);
        console.log("Student Balance:", student.accountBalance);
        console.log("Instructor:", instructor.name);
        console.log("Instructor Balance:", instructor.accountBalance);

        return res.status(200).json({
            success: true,
            message: "Payment Successful",
            enrollment,
            studentBalance: student.accountBalance,
            instructorBalance: instructor.accountBalance,
        });

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};