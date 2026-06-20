
import jwt from "jsonwebtoken";
import User from "../models/user.js";
// import User from "../models/user.js";

export const googleLogin = async (req, res) => {


    console.log('api calingg g loginn')



    try {
        const {
            email,
            name,
            googleId,
            photoURL,
        } = req.body;




        console.log('data',
            email,
            name,
            googleId,
            photoURL,

        )


        // DB me user check
        let user = await User.findOne({
            email,
        });


        // Pehli baar Google Login
        if (!user) {

            user = await User.create({
                name,
                email,
                googleId,
                avatar: photoURL,
                provider: "google",
                isVerified: true,
            });

        }


        // User already exist
        else {

            // agar pehle email se bana tha
            if (!user.googleId) {
                user.googleId = googleId;
                user.provider = "both";

                if (!user.avatar) {
                    user.avatar = photoURL;
                }

                await user.save();
            }

        }


        // JWT create
        const token = jwt.sign(
            {
                id: user._id,
                role: user.role,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d",
            }
        );


        console.log('tokne', token)


        // Cookie
        res.cookie(
            "token",
            token,
            {
                httpOnly: true,
                sameSite: "lax",
                secure: false,
                maxAge:
                    1000 * 60 * 60 * 24 * 7,
            }
        );


        return res.status(200).json({
            success: true,
            message: "Google Login Successful",
            user,
        });


    } catch (error) {

        console.log(error);

        return res.status(500).json({
            success: false,
            message: error.message,
        });

    }
};


















export const logout = async (req, res) => {

    try {

        res.clearCookie("token", {
            httpOnly: true,
            sameSite: "lax",
            secure: false,
            path: "/"
        });


        return res.status(200).json({
            success: true,
            message: "Logout successful"
        });


    } catch (error) {

        console.log(error);

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }

};