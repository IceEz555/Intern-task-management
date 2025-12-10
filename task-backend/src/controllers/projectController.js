import pool from '../config/db.js';

// Get all projects for the dashboard
// Get all projects for the dashboard
export const getProjects = async (req, res) => {
    try {
        // Query to get projects with task counts
        const query = `
            SELECT 
                p.*,
                (SELECT COUNT(*) FROM tasks t WHERE t.project_id = p.project_id) as task_count,
                (SELECT COUNT(*) FROM tasks t WHERE t.project_id = p.project_id AND t.status = 'Done') as done_task_count
            FROM projects p
            ORDER BY p.updated_at DESC
        `;

        const result = await pool.query(query);

        // Format data
        const projects = result.rows.map(project => ({
            ...project,
            id: project.project_id,
            name: project.project_name,
            description: project.project_description,
            status: project.project_status,
            start_date: project.start_date,
            end_date: project.end_date,
            // Calculate progress percentage
            progress: project.task_count > 0
                ? Math.round((parseInt(project.done_task_count) / parseInt(project.task_count)) * 100)
                : 0,
            members: [] // Placeholder for members, to be implemented with ProjectMembers table
        }));

        res.json(projects);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Server error" });
    }
};

// Create a new project
export const createProject = async (req, res) => {
    const { project_name, project_description, project_status, project_start_date, project_end_date } = req.body;
    const created_by = req.user.user_id;

    try {
        const query = `
            INSERT INTO projects (project_name, project_description, project_status, start_date, end_date, created_by)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *
        `;
        const values = [project_name, project_description, project_status || 'Planning', project_start_date, project_end_date, created_by];
        const result = await pool.query(query, values);

        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Server error" });
    }
};

// Get project details by ID with tasks and members
// Get project details by ID with tasks and members
export const getProjectById = async (req, res) => {
    const { id } = req.params;
    console.log(`[DEBUG] Fetching project ID: ${id}`);

    try {
        // 1. Get Project Details
        const projectQuery = `
            SELECT 
                p.project_id,
                p.project_name,
                p.project_description,
                p.project_status,
                p.start_date,
                p.end_date,
                p.created_by,
                p.created_at,
                p.updated_at,
                (SELECT COUNT(*) FROM tasks t WHERE t.project_id = p.project_id) as task_count,
                (SELECT COUNT(*) FROM tasks t WHERE t.project_id = p.project_id AND t.status = 'Done') as done_task_count
            FROM projects p
            WHERE p.project_id = $1
        `;
        const projectResult = await pool.query(projectQuery, [id]);

        if (projectResult.rows.length === 0) {
            console.log(`[DEBUG] Project not found`);
            return res.status(404).json({ message: "Project not found" });
        }

        const project = projectResult.rows[0];

        // 2. Get Tasks
        const taskQuery = `
            SELECT 
                t.task_id as id, 
                t.title, 
                t.description,
                t.status, 
                t.priority,
                t.due_date,
                u.fullname as assignee,
                u.avatar as assignee_avatar
            FROM tasks t
            LEFT JOIN users u ON t.assignee_id = u.user_id
            WHERE t.project_id = $1
            ORDER BY t.created_at DESC
        `;
        const taskResult = await pool.query(taskQuery, [id]);

        // 3. Get Members
        const memberQuery = `
            SELECT 
                u.user_id, 
                u.fullname as name, 
                u.email, 
                u.avatar,
                u.role
            FROM projectmembers pm
            JOIN users u ON pm.user_id = u.user_id
            WHERE pm.project_id = $1
        `;
        const memberResult = await pool.query(memberQuery, [id]);

        // Combine data
        const responseData = {
            ...project,
            // Map keys to match frontend expectations
            name: project.project_name,
            description: project.project_description,
            status: project.project_status,
            dueDate: project.end_date ? new Date(project.end_date).toISOString().split('T')[0] : null,
            tasks: taskResult.rows,
            members: memberResult.rows
        };

        res.json(responseData);
    } catch (err) {
        console.error("[ERROR] getProjectById failed:", err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

// Add a member to a project
export const addProjectMember = async (req, res) => {
    const { id } = req.params; // projectId
    const { user_id } = req.body;

    try {
        // Check if already a member
        const checkQuery = `SELECT * FROM projectmembers WHERE project_id = $1 AND user_id = $2`;
        const checkResult = await pool.query(checkQuery, [id, user_id]);

        if (checkResult.rows.length > 0) {
            return res.status(400).json({ message: "User is already a member of this project" });
        }

        // Add member
        const insertQuery = `
            INSERT INTO projectmembers (project_id, user_id)
            VALUES ($1, $2)
            RETURNING *
        `;
        await pool.query(insertQuery, [id, user_id]);

        res.status(201).json({ message: "Member added successfully" });
    } catch (err) {
        console.error("[ERROR] addProjectMember failed:", err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

// Remove a member from a project
export const removeProjectMember = async (req, res) => {
    const { id, userId } = req.params;

    try {
        const deleteQuery = `DELETE FROM projectmembers WHERE project_id = $1 AND user_id = $2`;
        await pool.query(deleteQuery, [id, userId]);

        res.json({ message: "Member removed successfully" });
    } catch (err) {
        console.error("[ERROR] removeProjectMember failed:", err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
};
