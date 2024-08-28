import request from "supertest";
import app from "../app.js";
import mongoose from "mongoose";

beforeAll(async () => {
    await mongoose.connect(process.env.TEST_DATABASE_URL)
        .then(() => console.log("Test database connected"))
        .catch((error) => console.log("Databse error: ", error.message));
});

afterAll(async () => {
    await mongoose.connection.close();
});

describe("Auth routes", () => {
    it("should sign in a user", async () => {
        const response = await request(app).post("/api/auth/signin")
        .send({ 
            email: "nahyan@chat.com",
            password: "Password@123"
        })
        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty("user")

    });

    it("Should return 401 if not signed in", async () => {
        const response = await request(app).get("/api/auth/user-info")
        expect(response.status).toBe(401)
    });

});