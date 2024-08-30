import request from "supertest";
import app from "../app.js";
import mongoose from "mongoose";


beforeAll(async () => {
    await mongoose.connect(process.env.TEST_DATABASE_URL)
    .catch((error) => console.log("Databse error: ", error.message));
});

afterAll(async () => {
    await mongoose.connection.close();
});

let cookie;
let groupId;
let userId;
describe("Group routes", () => {
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

    it("Create a new group", async () => {
        const response = await request(app).post("/api/groups/create-group")
        .set('cookie', cookie)
        .send({
            name: "New Group",
        })
        expect(response.status).toBe(201)
        expect(response.body).toHaveProperty("data")
        expect(response.body.data).toHaveProperty("name", "New Group")
        groupId = response.body.data.groupId;
    });

    it("Edit group", async () => {
        const response = await request(app).patch(`/api/groups/edit-group/${groupId}`)
        .set('cookie', cookie)
        .send({
            name: "Edited Group",
        })
        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty("data")
        expect(response.body.data).toHaveProperty("name", "Edited Group")
    });

    it("Get all groups", async () => {
        const response = await request(app).get("/api/groups/get-groups")
        .set('cookie', cookie)
        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty("groups")
        expect(response.body.groups).toBeInstanceOf(Array)
    });

    it("Search groups", async () => {
        const response = await request(app).get("/api/groups/search?filter=edi")
        .set('cookie', cookie)
        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty("groups")
        expect(response.body.groups).toBeInstanceOf(Array)
    });

    it("Create user", async () => {
        const response = await request(app).post("/api/users/create-user")
        .set('cookie', cookie)
        .send({
            firstName: "Group",
            lastName: "Member",
            email: "groupmember@gmail.com",
            password: "Password@123"
        })
        expect(response.status).toBe(201)
        expect(response.body).toHaveProperty("user")
        userId = response.body.user._id;
    });

    it("Add members to group", async () => {
        const response = await request(app).patch(`/api/groups/add-members/${groupId}`)
        .set('cookie', cookie)
        .send({
            members: [userId]
        })
        console.log("response", response.body)
        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty("data")
        expect(response.body.data).toHaveProperty("members")
        expect(response.body.data.members).toBeInstanceOf(Array)
    });

    it("Remove members from group", async () => {
        const response = await request(app).patch(`/api/groups/remove-members/${groupId}`)
        .set('cookie', cookie)
        .send({
            members: ["60b9d9c6c6b5d40015f9d5f5"]
        })
        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty("data")
        expect(response.body.data).toHaveProperty("members")
        expect(response.body.data.members).toBeInstanceOf(Array)
    });

    it("Delete group", async () => {
        const response = await request(app).delete(`/api/groups/delete-group/${groupId}`)
        .set('cookie', cookie)
        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty("message", "Group deleted successfully")
    });
    
});
