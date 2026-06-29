// Apna compile kiya hua langgraph app import karein
import app from "../agent/agent.js"



export const refund = async (req, res) => {
    try {

        const {
            prompt,
            userId,
            courseId
        } = req.body;


        console.log("REQUEST DATA:", {
            prompt,
            userId,
            courseId
        });


        if (!prompt) {
            return res.status(400).json({
                success: false,
                message: "Prompt is required"
            });
        }


        const response = await app.invoke(
            {
                messages: [
                    {
                        role: "user",
                        content: prompt
                    }
                ]
            },
            {
                configurable: {
                    userId,
                    courseId
                }
            }
        );


        const lastMessage =
            response.messages[response.messages.length - 1];


        return res.status(200).json({
            success: true,
            reply: lastMessage.content
        });


    } catch (error) {

        console.log("Refund Agent Error:", error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};