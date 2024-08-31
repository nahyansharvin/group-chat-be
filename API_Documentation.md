## Live Chat App API Documentation

### API Endpoints

**Authentication:**

- **POST /api/auth/signin**

  - Body:
    - `email` (string): User's email address.
    - `password` (string): User's password.
  - Response:
    - `message` (string): Success message.
    - `user` (object): Authenticated user information (id, firstName, lastName, email, role).
    - `cookie` (httpOnly Cookie): Cookie will be set in the browser.

- **POST /api/auth/signout**

  - Response:
    - `message` (string): Success message.
    - `cookie` (httpOnly Cookie): Cookie will be removed from the browser.

- **GET /api/auth/user-info**
  - Response:
    - `user` (object): Current authenticated user information (id, firstName, lastName, email, role).

**Profiles:**

- **Admin Endpoints:**

  - **POST /api/users/create-user**
    - Body:
      - `firstName` (string): User's first name.
      - `lastName` (string): User's last name.
      - `email` (string): User's email address.
      - `password` (string): User's password.
      - `role` (string, optional): User's role (default: "user").
    - Response:
      - `message` (string): Success message.
      - `user` (object): Created user information.
  - **PATCH /api/users/update-user/:userId**
    - Body:
      - `firstName` (string, optional): Updated first name.
      - `lastName` (string, optional): Updated last name.
      - `email` (string, optional): Updated email address.
      - `password` (string, optional): Updated password.
      - `role` (string, optional): Updated role.
    - Response:
      - `message` (string): Success message.
      - `user` (object): Updated user information.
  - **DELETE /api/users/delete/:userId**
    - Response:
      - `message` (string): Success message.

- **Unrestricted Endpoints:**
  - **GET /api/users/all-users**
    - Response:
      - `users` (array): Array of user objects.
  - **GET /api/users/search?filter**
    - Query Parameters:
      - `filter` (string): Filter users based on name or email.
    - Response:
      - Same as `/api/users/all-users`.

**Groups:**

- **POST /api/groups/create-group**

  - Body:
    - `name` (string): Group name.
    - `members` (array, optional): Array of user IDs to add.
  - Response:
    - `message` (string): Success message.-
    - `data` (object): Created group information (groupId, name).

- **PATCH /api/groups/edit-group/:groupId**

  - Body:
    - `name` (string): Updated group name.
  - Response:
    - Same as `/api/groups/create-group`.

- **DELETE /api/groups/delete-group/:groupId**

  - Url Parameters:
    - `groupId` (string): Group ID.
  - Response:
    - `message` (string): Success message.

- **PATCH /api/groups/add-members/:groupId**

  - Url Parameters:
    - `groupId` (string): Group ID.
  - Body:
    - `members` (array): Array of user IDs to add.
  - Response:
    - `message` (string): Success message.
    - `data` (object): Updated group information (groupId, name, members).

- **PATCH /api/groups/remove-members/:groupId**

  - Url Parameters:
    - `groupId` (string): Group ID.
  - Body:
    - `userIds` (array): Array of user IDs to remove.
  - Response:
    - `message` (string): Success message.
    - `data` (object): Updated group information (groupId, name, members).

- **PATCH /api/groups/leave-group/:groupId**

  - Url Parameters:
    - `groupId` (string): Group ID.
  - Response:
    - `message` (string): Success message.

- **GET /api/groups/get-groups**

  - Response:
    - `groups` (array): Array of groups the user belongs to.

- **GET /api/groups/search?filter**
  - Query Parameters:
    - `filter` (string): Filter groups based on name.
  - Response:
    - Same as `/api/groups/get-groups` with filtering.

**Messages:**

- **GET /api/messages/get-user-messages/:userId**

  - Url Parameters:
    - `userId` (string): User ID.
  - Response:
    - `messages` (array): Array of messages between the current user and the specified user.

- **GET /api/messages/get-group-messages/:groupId**
  - Url Parameters:
    - `groupId` (string): Group ID.
  - Response:
    - `messages` (array): Array of messages within the specified group.

**Chats:**

- **GET /api/chats**
  - Response:
    - `directChatList` (array): Array of chat objects (id, firstName, lastName, email, lastMessageTime).

### Socket Events

*These events can be emitted and listened. The response will come with same event name.*

- **"direct-message"**
  - Data:
    - `message` (string): Message content.
    - `receiver` (string): Receiver's user ID.
- **"group-message"**
  - Data:
    - `message` (string): Message content.
    - `groupId` (string): Group ID.
- **"edit-message"**
  - Data:
    - `messageId` (string): Message ID.
    - `message` (string): Updated message content.
- **"delete-message"**
  - Data:
    - `messageId` (string): Message ID.
- **"mark-as-read"**
  - Data:
    - `userId` (string): senders userId.
- **"like-message"**
  - Data:
    - `messageId` (string): Message ID.
- **"unlike-message"**
  - Data:
    - `messageId` (string): Message ID.

*This event to be only listened and not emitted.*

- **"error"** (Will be emitted if there is an error)
  - Data:
    - `error` (string): Error string.
    - `message` (string): Error message.

### Note:

- All endpoints require authentication.
- Admin-only endpoints are restricted to users with the "admin" role.
