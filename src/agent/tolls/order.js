import { tool } from "@langchain/core/tools";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { z } from "zod";
import Enrollment from "../../models/Enrollment.js";



export const checkRefundEligibilityTool = tool(
    async ({ userId, courseId }) => {


        console.log('toll caling hua ...')
        try {

            const enrollment = await Enrollment.findOne({
                student: userId,
                course: courseId,
            });

            if (!enrollment) {
                return {
                    success: false,
                    eligible: false,
                    message: "You are not enrolled in this course.",
                };
            }

            if (enrollment.refunded) {
                return {
                    success: false,
                    eligible: false,
                    message: "Refund has already been processed.",
                };
            }

            const now = new Date();

            if (now > enrollment.refundExpiry) {
                return {
                    success: false,
                    eligible: false,
                    message: "The 7-day refund period has expired.",
                };
            }

            return {
                success: true,
                eligible: true,
                enrollmentId: enrollment._id,
                amount: enrollment.amount,
                purchasedAt: enrollment.purchasedAt,
                refundExpiry: enrollment.refundExpiry,
                message: "User is eligible for a refund.",
            };

        } catch (error) {

            return {
                success: false,
                eligible: false,
                message: error.message,
            };

        }
    },
    {
        name: "check_refund_eligibility",
        description:
            "Check whether a user is eligible for a refund using their userId and courseId. Always call this tool before creating a refund request.",

        schema: z.object({
            userId: z.string().describe("User ID"),
            courseId: z.string().describe("Course ID"),
        }),
    }
);

export const tools = [
    checkRefundEligibilityTool,
];

export const toolNode = new ToolNode(tools);