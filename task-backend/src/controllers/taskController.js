import pool from '../config/db.js';

// Create a new task
export const createTask = async (req, res) => {
    // 1. รับค่าที่ Frontend ส่งมา
    const { title, description, status, priority, due_date, project_id, assignee_id } = req.body;

    try {
        // 2. เขียนคำสั่ง SQL เพื่อบันทึกข้อมูล
        const query = `
            INSERT INTO tasks (title, description, status, priority, due_date, project_id, assignee_id)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *
        `;

        // 3. เตรียมข้อมูลที่จะใส่ลงใน $1, $2, ...
        // ถ้า assignee_id เป็นค่าว่าง '' ให้เปลี่ยนเป็น null (ไม่มีคนรับผิดชอบ)
        const values = [
            title,
            description,
            status || 'To Do',
            priority || 'Medium',
            due_date || null,
            project_id,
            assignee_id || null
        ];

        // 4. สั่งรันคำสั่ง SQL
        const result = await pool.query(query, values);

        // 5. ส่งข้อมูลงานที่เพิ่งสร้างเสร็จกลับไปบอก Frontend
        res.status(201).json(result.rows[0]);

    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Server error" });
    }
};

// Update task
export const updateTask = async (req, res) => {
    const { task_id, title, description, status, priority, due_date, assignee_id } = req.body;
    try {
        //  UPDATE ให้ใช้ฟังก์ชัน COALESCE ของ SQL ความหมายคือ: ให้ใช้ค่าใหม่ที่ส่งมา ($2) แต่ถ้าค่าใหม่ไม่มี (เป็น null) ให้กลับไปใช้ค่าเดิม (title) จากในฐานข้อมูล
        const query = `
            UPDATE tasks 
            SET title = COALESCE($2, title),
                description = COALESCE($3, description),
                status = COALESCE($4, status),
                priority = COALESCE($5, priority),
                due_date = COALESCE($6, due_date),
                assignee_id = COALESCE($7, assignee_id)
            WHERE task_id = $1
            RETURNING *
        `;
        const values = [
            task_id,
            title || null,
            description || null,
            status || null,
            priority || null,
            due_date || null,
            assignee_id || null
        ];
        const result = await pool.query(query, values);
        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

// Delete task
export const deleteTask = async (req, res) => {
    const { id } = req.params; // Fixed: route uses :id
    try {
        const query = 'DELETE FROM tasks WHERE task_id = $1 RETURNING *';
        const result = await pool.query(query, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Task not found" });
        }

        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Server error", error: err.message });
    }
};



