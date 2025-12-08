import pool from '../config/db.js';

export const getUsers = async (req, res) => {
    try {
        const result = await pool.query('SELECT user_id, fullname as name, email, role, status FROM Users ORDER BY user_id ASC');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};
