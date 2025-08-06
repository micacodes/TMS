# Task Manager API Documentation

This document provides details on all available API endpoints for the Task Manager application.

**Base URL:** `/api`

---

### Authentication (`/api/auth`)

| Method | Endpoint             | Access  | Description                                        |
| :----- | :------------------- | :------ | :------------------------------------------------- |
| `POST` | `/register`          | Public  | Registers a new user.                              |
| `POST` | `/login`             | Public  | Logs in a user and returns a JWT.                  |
| `POST` | `/logout`            | Public  | (Informational) Logs out a user.                   |

**`POST /register`**
- **Body:** `fullName`, `username`, `email`, `password`
- **Success Response (201):** `{ "message": "User registered successfully", "userId": 1 }`

**`POST /login`**
- **Body:** `email`, `password`
- **Success Response (200):** `{ "message": "Login successful", "token": "...", "user": { ... } }`

---

### Tasks (`/api/tasks`)

All task endpoints are **private** and require a valid JWT in the `Authorization: Bearer <token>` header.

| Method   | Endpoint        | Description                               |
| :------- | :-------------- | :---------------------------------------- |
| `GET`    | `/`             | Get all tasks for the authenticated user. Can be filtered with query params (`status`, `search`). |
| `POST`   | `/`             | Create a new task.                        |
| `GET`    | `/:id`          | Get a specific task by its ID.            |
| `PUT`    | `/:id`          | Update a specific task.                   |
| `DELETE` | `/:id`          | Delete a specific task.                   |

**`POST /` (Create Task)**
- **Body:** `title` (required), `description`, `priority`, `due_date`
- **Success Response (201):** `{ "message": "Task created successfully", "taskId": 1 }`

**`PUT /:id` (Update Task)**
- **Body:** `title` (required), `description`, `priority`, `status`, `due_date`
- **Success Response (200):** `{ "message": "Task updated successfully." }`