import mongoose from "mongoose";

const connectDB = async () => {

    console.log('dnd', process.env.MONGODB_URI)

    try {

        const MONGODB_URI = process.env.MONGODB_URI

        if (!MONGODB_URI) {
            throw new Error(
                "MONGODB_URI missing in .env"
            );
        }


        const conn = await mongoose.connect(
            MONGODB_URI,
            {
                dbName: "course_platform",
            }
        );


        console.log(
            `MongoDB Connected: ${conn.connection.host}`
        );


    } catch (error) {

        console.log(
            "MongoDB Connection Error:",
            error.message
        );

        process.exit(1);
    }
};


export default connectDB;