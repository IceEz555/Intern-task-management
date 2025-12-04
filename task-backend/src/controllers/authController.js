import pool from '../config/db.js';

export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Query user from DB
        const result = await pool.query('SELECT * FROM Users WHERE email = $1', [email]);

        if (result.rows.length === 0) {
            return res.status(401).json({ message: 'Email or password is incorrect' });
        }

        const user = result.rows[0];

        // Simple password check (In production, use bcrypt!)
        if (password !== user.password) {
            return res.status(401).json({ message: 'Email or password is incorrect' });
        }

        // Check status
        if (user.status !== 'Active') {
            return res.status(403).json({ message: 'Your account is suspended or on leave' });
        }

        // Return user info (exclude password)
        const { password: _, ...userWithoutPassword } = user;

        // Map DB fields to Frontend expected format
        const responseUser = {
            ...userWithoutPassword,
            name: user.fullname,
        };

        res.json({ user: responseUser });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};
