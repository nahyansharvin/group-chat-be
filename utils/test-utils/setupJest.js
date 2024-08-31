import request from "supertest";
import mongoose from "mongoose"
import User from "../../models/UserModel.js";
import app from "../../app.js";

export default async () => {
    await mongoose.connect("mongodb://localhost:27017/live-chat-app-test")
        .catch((error) => console.log("Databse error: ", error.message));

    // Create Admin User
    const user = await User.create({
        firstName: "Test",
        lastName: "Admin",
        email: "admin1@gmail.com",
        password: "Password@123",
        role: "admin"
    });
    global.admin = user.firstName + " " + user.lastName;
    global.adminId = user._id.toString();

    // Create User 2
    const user2 = await User.create({
        firstName: "Test",
        lastName: "User",
        email: "testuser@gmail.com",
        password: "Password@123"
    });
    global.user = user2.firstName + " " + user2.lastName;
    global.userId = user2._id.toString();

    // Signin Admin User
    const response = await request(app).post("/api/auth/signin")
        .send({
            email: "admin1@gmail.com",
            password: "Password@123"
        })
    global.adminCookie = response.headers["set-cookie"];

    // Signin Normal User
    const response2 = await request(app).post("/api/auth/signin")
        .send({
            email: "testuser@gmail.com",
            password: "Password@123"
        })
    global.userCookie = response2.headers["set-cookie"];


    await mongoose.connection.close();
}