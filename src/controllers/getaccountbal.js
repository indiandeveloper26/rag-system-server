import mongoose from "mongoose";
import User from "../models/user.js";

export const getAccountBalance = async (req, res) => {
    try {
        const { id } = req.params;

        console.log('res apraat', req.params)

        // Check id exists
        if (!id) {
            return res.status(400).json({
                success: false,
                message: "User ID is required.",
            });
        }

        // Validate MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid User ID.",
            });
        }

        const user = await User.findById(id).select("accountBalance");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found.",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Account balance fetched successfully.",
            accountBalance: user.accountBalance,
        });
    } catch (error) {
        console.error("Get Account Balance Error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error.",
            error:
                process.env.NODE_ENV === "development"
                    ? error.message
                    : undefined,
        });
    }
};