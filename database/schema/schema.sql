-- Drop tables if they exist to start fresh
DROP TABLE IF EXISTS tasks;
DROP TABLE IF EXISTS users;
DROP TYPE IF EXISTS task_priority;
DROP TYPE IF EXISTS task_status;

-- Users Table (PostgreSQL syntax)
CREATE TABLE users (
    id SERIAL PRIMARY KEY, -- 'SERIAL' is the auto-incrementing integer in Postgres
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    username VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Custom ENUM types for strict data validation (a strong feature in Postgres)
CREATE TYPE task_priority AS ENUM ('low', 'medium', 'high');
CREATE TYPE task_status AS ENUM ('pending', 'completed');

-- Tasks Table (PostgreSQL syntax)
CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    priority task_priority DEFAULT 'medium',
    status task_status DEFAULT 'pending',
    due_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_tasks_user_id ON tasks(user_id);
CREATE INDEX idx_tasks_status ON tasks(status);