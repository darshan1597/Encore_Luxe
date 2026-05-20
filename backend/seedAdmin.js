import dotenv from "dotenv";
dotenv.config();
import bcrypt from "bcryptjs"
import mongoose from "mongoose";
import Admin from "./models/admin.model.js";

async function createAdmin() {
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("MongoDB connected");
        const hashedPassword = await bcrypt.hash(
            "Darshan@123",
            10
        );

        const admin = new Admin({
            fullName: "Darshan",
            email: "darshanradha1597@gmail.com",
            mobile: "6366063615",
            password: hashedPassword,
            role: "superAdmin"
        });

        await admin.save();

        console.log("Admin created");
        process.exit();
    } catch(err){
        console.log(err);
        process.exit();
    }
}

createAdmin();
