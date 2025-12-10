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
    // Assume req.user.user_id is available from auth middleware
    const created_by = 1; // Default to admin for now

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
