import request from "supertest";
import app from "../app.js";

const userCookie = global.userCookie;
const userToAdd = global.adminId;
let groupId;

describe("Group routes", () => {
    it("Create a new group", async () => {
        const response = await request(app).post("/api/groups/create-group")
        .set('cookie', userCookie)
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
        .set('cookie', userCookie)
        .send({
            name: "Edited Group",
        })
        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty("data")
        expect(response.body.data).toHaveProperty("name", "Edited Group")
    });

    it("Get all groups", async () => {
        const response = await request(app).get("/api/groups/get-groups")
        .set('cookie', userCookie)
        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty("groups")
        expect(response.body.groups).toBeInstanceOf(Array)
    });

    it("Search groups", async () => {
        const response = await request(app).get("/api/groups/search?filter=edi")
        .set('cookie', userCookie)
        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty("groups")
        expect(response.body.groups).toBeInstanceOf(Array)
    });

    it("Add members to group", async () => {
        const response = await request(app).patch(`/api/groups/add-members/${groupId}`)
        .set('cookie', userCookie)
        .send({
            members: [userToAdd]
        })
        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty("data")
        expect(response.body.data).toHaveProperty("members")
        expect(response.body.data.members).toBeInstanceOf(Array)
    });

    it("Remove members from group", async () => {
        const response = await request(app).patch(`/api/groups/remove-members/${groupId}`)
        .set('cookie', userCookie)
        .send({
            members: [userToAdd]
        })
        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty("data")
        expect(response.body.data).toHaveProperty("members")
        expect(response.body.data.members).toBeInstanceOf(Array)
    });

    it("Delete group", async () => {
        const response = await request(app).delete(`/api/groups/delete-group/${groupId}`)
        .set('cookie', userCookie)
        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty("message", "Group deleted successfully")
    });
    
});
