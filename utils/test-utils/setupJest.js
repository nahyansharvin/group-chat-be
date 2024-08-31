import mongoose from "mongoose"
import User from "../../models/UserModel.js";

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
    global.user = user.firstName + " " + user.lastName;
    global.userId = user._id.toString();

    // Create User 2
    const user2 = await User.create({
        firstName: "Test",
        lastName: "User",
        email: "testuser@gmail.com",
        password: "Password@123"
    });
    global.user2 = user2.firstName + " " + user2.lastName;
    global.user2Id = user2._id.toString();

    await mongoose.connection.close();
}