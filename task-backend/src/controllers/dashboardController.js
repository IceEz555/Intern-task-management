import pool from '../config/db.js';

export const getDashboardStats = async (req, res) => {
    try {
        // 1. Total Users
        const userCountResult = await pool.query('SELECT COUNT(*) FROM users');
        const totalUsers = parseInt(userCountResult.rows[0].count);

        // 2. Active Projects (Not Completed)
        const projectCountResult = await pool.query("SELECT COUNT(*) FROM projects WHERE project_status != 'Completed'");
        const activeProjects = parseInt(projectCountResult.rows[0].count);

        // 3. Tasks Completed
        const taskCountResult = await pool.query("SELECT COUNT(*) FROM tasks WHERE status = 'Done'");
        const completedTasks = parseInt(taskCountResult.rows[0].count);

        // 4. User Distribution by Role
        const userDistResult = await pool.query("SELECT role, COUNT(*) as count FROM users GROUP BY role");
        const userDistribution = userDistResult.rows.map(row => ({
            role: row.role,
            count: parseInt(row.count)
        }));

        res.json({
            totalUsers,
            activeProjects,
            completedTasks,
            userDistribution
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Server error" });
    }
};
