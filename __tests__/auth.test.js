import request from "supertest";
import app from "../app.js";
import mongoose from "mongoose";
import User from "../models/UserModel.js";

let cookie;

beforeAll(async () => {
    await mongoose.connect(process.env.TEST_DATABASE_URL)
        .then(() => console.log("Test database connected"))
        .catch((error) => console.log("Databse error: ", error.message));
    
    // Create Admin User
    await User.create({
        firstName: "Test",
        lastName: "Admin",
        email: "admin1@gmail.com",
        password: "Password@123",
        role: "admin"
    });
});

afterAll(async () => {
    await mongoose.connection.db.dropDatabase();
    await mongoose.connection.close();
});

describe("Auth routes", () => {
    it("Should return 401 if not signed in", async () => {
        const response = await request(app).get("/api/auth/user-info")
        expect(response.status).toBe(401)
    });

    it("Sign in as admin", async () => {
        const response = await request(app).post("/api/auth/signin")
        .send({ 
            email: "admin1@gmail.com",
            password: "Password@123"
        })
        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty("user")
        cookie = response.headers["set-cookie"];
    });

    it("Should return user info", async () => {
        const response = await request(app).get("/api/auth/user-info")
        .set('cookie', cookie)
        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty("user")
    });
    
});
