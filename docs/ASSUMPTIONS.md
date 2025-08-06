# Project Assumptions & Design Decisions

This document outlines the key assumptions and architectural decisions made during the development of this project.

### 1. Authentication Strategy

-   **JWT over Sessions:** We chose stateless JWT (JSON Web Token) authentication over traditional server-side sessions. This is ideal for modern applications where the frontend and backend are decoupled. It simplifies scaling, as the server does not need to store session state.
-   **Client-Side Logout:** The `/api/auth/logout` endpoint is informational. In a stateless JWT system, true logout is handled on the client-side by deleting the stored token. For higher security, a production system could implement a token blocklist.

### 2. Security Practices

-   **Password Hashing:** `bcryptjs` was chosen for password hashing due to its adaptive hashing and inclusion of a salt, which protects against rainbow table attacks.
-   **Input Validation & Sanitization:** All user input is validated and sanitized at the API edge (in the route files) using `express-validator`. This prevents malformed or malicious data from reaching the application logic.
-   **Rate Limiting:** A strict rate limit is applied only to the authentication endpoints to mitigate brute-force attacks without affecting the user experience for authenticated users.
-   **Data Isolation:** All database queries for tasks are strictly scoped to the `user_id` of the authenticated user. This is the most critical measure to ensure a user can never access another user's data.

### 3. Database Choice

-   **MySQL (Relational):** A relational database was chosen because the data structure is well-defined and has clear relationships (users have tasks). MySQL's `ENUM` types and `FOREIGN KEY` constraints provide strong data integrity at the database level.
-   **NoSQL Consideration:** A NoSQL database like MongoDB could have been used, but the structured nature of the data and the importance of relationships made a relational database a better fit for this specific use case.

### 4. Frontend Architecture

-   **Global State Management:** React's Context API (`AuthContext`) was used for managing global authentication state. For a larger application, a more robust solution like Redux or Zustand might be considered, but for this scope, Context is a clean and sufficient solution.
-   **Optimistic UI:** For actions like updating a task's status, the UI is updated *before* the API call completes. This makes the application feel instantaneous. If the API call fails, the UI change is reverted.