## Live Chat App: Real-Time Communication Made Easy

This Node.js application offers a secure and scalable platform for real-time 1-on-1 and group chat functionalities. Socket.io provides the backbone for instant messaging, and MongoDB serves as the reliable data storage solution. This project follows the Model-View-Controller (MVC) architecture.

### Key Features:

* **1-on-1 and Group Chat:** Seamlessly communicate with individuals or groups in real-time.
* **Authentication:** Secure access with HTTP-only cookies for session management.
* **User Management:** Create, update, and manage user profiles (admin-controlled user creation).
* **Group Management:** Create, edit, delete, and manage group memberships.
* **Message History:** Access your chat history with individual users and groups.

### Technologies Used:

* Node.js
* Express.js
* Socket.io
* MongoDB
* Jest (for testing)
* Supertest (for API testing)
* Bcrypt (for password hashing)
* JWT (for authentication)

### Installation:

1. Clone the repository:

   ```bash
   git clone https://github.com/nahyansharvin/group-chat-be.git
   ```

2. Install dependencies:

   ```bash
   cd group chat
   npm install
   ```

3. Configure environment variables:

   Create a `.env` file in the project root and add the following variables with your actual values:

   - `PORT`: Port on which the server listens (e.g., 3000)
   - `JWT_SECRET`: A strong, random string for cookie signing
   - `ORIGIN`: Allowed origin for cookies (e.g., `http://localhost:3000`)
   - `DATABASE_URL`: MongoDB connection URI

### Usage:

1. Start the server:

   ```bash
   npm start
   ```

### API Endpoints (All Private - Authentication Required):

**Authentication:**

- `POST /api/auth/signin`: Login with credentials.
- `POST /api/auth/signout`: Logout and clear cookies.
- `GET /api/auth/user-info`: Retrieve currently authenticated user information.

**Profiles:**

* **Admin Endpoints:**
    - `POST /api/users/create-user`: Create a new user (admin-only).
    - `PATCH /api/users/update-user/:userId`: Update user details (admin-only).
    - `DELETE /api/users/delete/:userId`: Delete a user (admin-only).
* **Unrestricted Endpoints(Authenticated):**
    - `GET /api/users/all-users`: Get all users.
    - `GET /api/users/search?filter`: Search users based on criteria.

**Groups:**

- `POST /api/groups/create-group`: Create a new group.
- `PATCH /api/groups/edit-group/:groupId`: Edit group details.
- `DELETE /api/groups/delete-group/:groupId`: Delete a group.
- `PATCH /api/groups/add-members/:groupId`: Add members to a group.
- `PATCH /api/groups/remove-members/:groupId`: Remove members from a group.
- `PATCH /api/groups/leave-group/:groupId`: Leave a group.
- `GET /api/groups/get-groups`: Get all groups user belongs to.
- `GET /api/groups/search?filter`: Search for groups based on criteria.

* Only user who created the group (group admin) can update or delete the group.

**Messages:**

- `GET /api/messages/get-user-messages/:userId`: Retrieve all messages between the current user and given user.
- `GET /api/messages/get-group-messages/:groupId`: Get all messages within a specific group.

**Chats:**

- `GET /api/chats`: Get a list of contacts with whom the user has chat history.

**Socket Events:**

These events facilitate real-time communication:

- `"direct-message"`: Send a direct message to another user.
- `"group-message"`: Send a message to a group.
- `"edit-message"`: Edit a message (restrictions may apply).
- `"delete-message"`: Delete a message (restrictions may apply).
- `"mark-as-read"`: Mark messages as read.
- `"like-message"`: Like a message (optional).
- `"unlike-message"`: Unlike a message (optional).
- `"error"`: Handles potential errors during communication.

### Testing:

Run endt to end tests using Jest and Supertest with:

```bash
npm test
```
The test suite is located in the `__tests__` directory.