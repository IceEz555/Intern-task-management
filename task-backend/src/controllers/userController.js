import pool from '../config/db.js';
import bcrypt from "bcrypt";

export const getUsers = async (req, res) => {
    try {
        const result = await pool.query('SELECT user_id, fullname as name, email, role, status, department FROM Users ORDER BY user_id ASC');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

export const createUser = async (req, res) => {
    try {
        const { name, email, role, status, password } = req.body;

        // Basic Validation
        if (!name || !role || !email || !password || !status) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const hashPassword = await bcrypt.hash(password, 10);

        try {
            // RETURNING fullname as name -> เพื่อให้ Frontend เอาไปแสดงผลต่อได้เลยโดยไม่ต้อง Refresh
            const result = await pool.query(
                'INSERT INTO users (fullname, email, role, status, password, department) VALUES ($1, $2, $3, $4, $5, $6) RETURNING user_id, fullname as name, email, role, status, department',
                [name, email, role, status, hashPassword, '']
            );
            res.status(201).json(result.rows[0]);
        }
        catch (dbError) {
            // 23505 = Unique Key Violation (Email ซ้ำ)
            if (dbError.code === '23505') {
                return res.status(409).json({ message: "This email is already registered." });
            }
            throw dbError;
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
}

export const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, role, status, password } = req.body;

        // Validation
        if (!name || !role || !email || !status) {
            return res.status(400).json({ message: "Fields required except password" });
        }
        let query = 'UPDATE Users SET fullname = $1, email = $2, role = $3, status = $4 WHERE user_id = $5 RETURNING user_id, fullname as name, email, role, status';
        let values = [name, email, role, status, id];

        // If password provided, hash and update it
        if (password && password.trim() !== "") {
            const hashPassword = await bcrypt.hash(password, 10);
            query = 'UPDATE Users SET fullname = $1, email = $2, role = $3, status = $4, password = $5 WHERE user_id = $6 RETURNING user_id, fullname as name, email, role, status';
            values = [name, email, role, status, hashPassword, id];
        }
        const result = await pool.query(query, values);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        // Unique violation
        if (err.code === '23505') {
            return res.status(409).json({ message: "Email already exists" });
        }
        res.status(500).json({ message: 'Server error' });
    }
};

export const updateProfile = async (req, res) => {
    try {
        const { id, name, department, jobTitle } = req.body; // Accept jobTitle for backward compatibility if needed, but prioritize department

        // Use department or jobTitle (if department not provided)
        const finalDepartment = department || jobTitle || '';

        if (!id) {
            return res.status(400).json({ message: "User ID is required" });
        }

        const query = 'UPDATE Users SET fullname = $1, department = $2 WHERE user_id = $3 RETURNING user_id, fullname as name, email, role, status, department';
        const values = [name, finalDepartment, id];

        const result = await pool.query(query, values);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        // Unique violation
        if (err.code === '23505') {
            return res.status(409).json({ message: "Email already exists" });
        }
        res.status(500).json({ message: 'Server error' });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('DELETE FROM Users WHERE user_id = $1 RETURNING user_id', [id]);

        if (result.rowCount === 0) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json({ message: "User deleted successfully", id });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};