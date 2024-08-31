import request from "supertest";
import app from "../app.js";

let createdUserId;
const adminCookie = global.adminCookie;
const userCookie = global.userCookie;

describe("Profile routes", () => {
    it("Should create new user", async () => {
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

    it("Should update user", async () => {
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
    
    it("Should get all users", async () => {
        const response = await request(app).get("/api/users/all-users")
        .set('cookie', userCookie)
        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty("users")
    });

    it("Should search users", async () => {
        const response = await request(app).get("/api/users/search?filter=Test")
        .set('cookie', userCookie)
        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty("users")
    });

    it("Should delete user", async () => {
        const response = await request(app).delete(`/api/users/delete/${createdUserId}`)
        .set('cookie', adminCookie)
        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty("message")
    })
});

describe("Unauthorized access", () => {
    it("Should return 403 if not admin", async () => {
        const response = await request(app).get("/api/users/create-user")
        .set('cookie', userCookie)
        expect(response.status).toBe(403)
    });
});
