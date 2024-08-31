import request from "supertest";
import app from "../app.js";

let cookie;

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

    it("Sign out", async () => {
        const response = await request(app).post("/api/auth/signout")
        .set('cookie', cookie)
        expect(response.status).toBe(200)
        expect(response.headers).toHaveProperty("set-cookie")
    });
    
});
