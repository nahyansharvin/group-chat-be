import mongoose from "mongoose"
import User from "../models/UserModel.js";

export default async () => {
    await mongoose.connect("mongodb://localhost:27017/live-chat-app-test")
        .catch((error) => console.log("Databse error: ", error.message));

    // Create Admin User
    await User.create({
        firstName: "Test",
        lastName: "Admin",
        email: "admin1@gmail.com",
        password: "Password@123",
        role: "admin"
    });

    await mongoose.connection.close();
}