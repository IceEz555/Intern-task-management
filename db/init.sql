-- ===============================
-- Init Database (PostgreSQL)
-- Intern Task Management
-- ===============================

-- ===============================
-- 1. users
-- ===============================
CREATE TABLE IF NOT EXISTS users (
    user_id SERIAL PRIMARY KEY,
    fullname VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL, -- Admin, PM, Member
    avatar VARCHAR(255),
    status VARCHAR(20) DEFAULT 'Active', -- Active, Inactive, On Leave
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    department VARCHAR(50)
);

-- ===============================
-- 2. projects
-- ===============================
CREATE TABLE IF NOT EXISTS projects (
    project_id SERIAL PRIMARY KEY,
    project_name VARCHAR(150) NOT NULL,
    project_description TEXT,
    project_status VARCHAR(50) DEFAULT 'Planning',
    start_date DATE,
    end_date DATE,
    created_by INTEGER REFERENCES users (user_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ===============================
-- Trigger for projects.updated_at
-- ===============================
CREATE OR REPLACE FUNCTION update_projects_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_projects_updated_at
BEFORE UPDATE ON projects
FOR EACH ROW
EXECUTE FUNCTION update_projects_updated_at();

-- ===============================
-- 3. projectmember
-- ===============================
CREATE TABLE IF NOT EXISTS projectmembers (
    pm_id SERIAL PRIMARY KEY,
    project_id INTEGER NOT NULL REFERENCES projects (project_id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users (user_id) ON DELETE CASCADE,
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ===============================
-- 4. tasks
-- ===============================
CREATE TABLE IF NOT EXISTS tasks (
    task_id SERIAL PRIMARY KEY,
    project_id INTEGER NOT NULL REFERENCES projects (project_id) ON DELETE CASCADE,
    assignee_id INTEGER REFERENCES users (user_id) ON DELETE SET NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'To Do', -- To Do, In Progress, Done
    priority VARCHAR(20) DEFAULT 'Medium', -- Low, Medium, High
    due_date DATE,
    tags JSONB, -- JSON Array เช่น ["Design", "Urgent"]
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ===============================
-- Trigger for tasks.updated_at
-- ===============================
CREATE OR REPLACE FUNCTION update_tasks_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_tasks_updated_at
BEFORE UPDATE ON tasks
FOR EACH ROW
EXECUTE FUNCTION update_tasks_updated_at();

-- ============================
-- Seed Data (DEV)
-- ============================
INSERT INTO
    users (
        email,
        password,
        fullname,
        role,
        department,
        status
    )
VALUES (
        'admin@internflow.com',
        '$2b$10$A0EjRcpc2JbfsUZKx7aYv.nuE1y.SrnibNii8D0hpEgdJiAgsdQ1q',
        'Admin User',
        'Admin',
        'IT',
        'Active'
    );