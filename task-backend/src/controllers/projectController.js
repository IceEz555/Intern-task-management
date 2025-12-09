import pool from '../config/db.js';

// Get all projects for the dashboard
export const getProjects = async (req, res) => {
    try {
        // Query to get projects with task counts
        // Note: Progress is hardcoded to random or 0 because we don't have task status logic fully driven yet.
        // We will improve "progress" calculation later based on done_tasks / total_tasks.
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

// Create a new project (Basic implementation for future use)
export const createProject = async (req, res) => {
    const { name, description, status, start_date, end_date } = req.body;
    // Assume req.user.user_id is available from auth middleware (to be added)
    const created_by = 1; // Default to admin for now if auth not fully linked here

    try {
        const query = `
            INSERT INTO projects (project_name, project_description, project_status, start_date, end_date, created_by)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *
        `;
        const values = [name, description, status || 'Planning', start_date, end_date, created_by];
        const result = await pool.query(query, values);

        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Server error" });
    }
};
