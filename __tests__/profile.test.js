import request from "supertest";
import app from "../app.js";
import mongoose from "mongoose";

let createdUserId;
const adminCookie = global.adminCookie;
const userCookie = global.userCookie;

beforeAll(async () => {
    await mongoose.connect(process.env.TEST_DATABASE_URL)
        .catch((error) => console.log("Databse error: ", error.message));
});

afterAll(async () => {
    await mongoose.connection.close();
});

describe("Profile routes", () => {
    it("Create user", async () => {
        const response = await request(app).post("/api/users/create-user")
        .set('cookie', adminCookie)
        .send({
            firstName: "Created",
            lastName: "User",
            email: "createduser@gmail.com",
            password: "Password@123"
        })
        expect(response.status).toBe(201)
        expect(response.body).toHaveProperty("user")
        createdUserId = response.body.user._id;
    });

    it("Update user", async () => {
        const response = await request(app).patch("/api/users/update-user/" + createdUserId)
        .set('cookie', adminCookie)
        .send({
            firstName: "Updated",
            email: "updateduser@gmail.com",
        })
        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty("user")
        expect(response.body.user.firstName).toBe("Updated")
        expect(response.body.user.email).toBe("updateduser@gmail.com")
    });
    
    it("Get all users", async () => {
        const response = await request(app).get("/api/users/all-users")
        .set('cookie', userCookie)
        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty("users")
    });

    it("Search users", async () => {
        const response = await request(app).get("/api/users/search?filter=Test")
        .set('cookie', userCookie)
        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty("users")
    });
});

describe("Unauthorized access", () => {
    it("Should return 403 if not admin", async () => {
        const response = await request(app).get("/api/users/create-user")
        .set('cookie', userCookie)
        expect(response.status).toBe(403)
    });
});
