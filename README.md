# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-v# Full-Stack Task Manager Application

A comprehensive task management application built with the MERN stack (MySQL, Express, React, Node.js). This project is designed to showcase full-stack development skills, including a secure RESTful API, a responsive user interface, and professional project structure.

## Core Features

-   **User Authentication:** Secure user registration and login using JWT (JSON Web Tokens).
-   **Task Management (CRUD):** Users can Create, Read, Update, and Delete their own tasks.
-   **Task Filtering & Searching:** Dynamically filter tasks by status (All, Pending, Completed) and search by title in real-time.
-   **Data Persistence:** All user and task data is stored in a MySQL database.
-   **Responsive Design:** The UI is fully responsive and works seamlessly on desktop and mobile devices.
-   **User Feedback:** The application provides clear loading states and toast notifications for all user actions.

## Tech Stack

-   **Frontend:** React, Vite, Tailwind CSS, Axios, `react-hot-toast`
-   **Backend:** Node.js, Express.js
-   **Database:** MySQL
-   **Authentication:** `jsonwebtoken` (JWT), `bcryptjs` for password hashing
-   **Security:** `helmet`, `express-rate-limit`, `express-validator` for input validation and sanitization.

---

## Getting Started

### Prerequisites

-   Node.js (v18 or later)
-   Bun (or npm/yarn)
-   MySQL Server
-   Docker (for containerized deployment)

### 1. Backend Setup

```bash
# Navigate to the backend directory
cd backend

# Install dependencies
bun install

# Create a .env file from the example
cp .env.example .env

# Edit the .env file with your MySQL credentials
# ...

# Set up the database (this will create the DB and tables)
mysql -u root -p < ../database/schema/schema.sql

# Start the backend server
bun run startite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
