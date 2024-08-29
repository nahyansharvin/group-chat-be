import mongoose from "mongoose"

export default async () => {
    await mongoose.connect("mongodb://localhost:27017/live-chat-app-test")
        .catch((error) => console.log("Databse error: ", error.message));

    await mongoose.connection.db.dropDatabase();
    await mongoose.connection.close();
}