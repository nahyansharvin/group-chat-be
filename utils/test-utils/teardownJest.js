import mongoose from "mongoose"
import { TEST_DATABASE_URL } from "../../constants/TestConstants.js";

export default async () => {
    await mongoose.connect(TEST_DATABASE_URL)
        .catch((error) => console.log("Databse error: ", error.message));

    await mongoose.connection.db.dropDatabase();
    await mongoose.connection.close();
}