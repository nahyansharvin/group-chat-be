import mongoose from "mongoose";
import { TEST_DATABASE_URL } from "../../constants/TestConstants.js";

beforeAll(async () => {
    await mongoose.connect(TEST_DATABASE_URL)
        .catch((error) => console.log("Databse error: ", error.message));
});

afterAll(async () => {
    await mongoose.connection.close();
});