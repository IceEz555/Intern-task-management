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

        // 5. Weekly Activity (Last 7 Days)
        const weeklyActivityResult = await pool.query(`
            SELECT 
                TO_CHAR(updated_at, 'Dy') as day,
                COUNT(*) as count
            FROM tasks 
            WHERE updated_at >= NOW() - INTERVAL '7 days'
            GROUP BY TO_CHAR(updated_at, 'Dy'), DATE(updated_at)
            ORDER BY DATE(updated_at) ASC
        `);

        // Fill in missing days with 0
        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        // Create a map for the last 7 days dynamically
        const last7Days = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
            last7Days.push({ day: dayName, count: 0 });
        }

        // Merge DB results into last7Days
        weeklyActivityResult.rows.forEach(row => {
            const dayIndex = last7Days.findIndex(d => d.day === row.day);
            if (dayIndex !== -1) {
                last7Days[dayIndex].count = parseInt(row.count);
            }
        });

        res.json({
            totalUsers,
            activeProjects,
            completedTasks,
            userDistribution,
            weeklyActivity: last7Days
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Server error" });
    }
};
