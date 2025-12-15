import pool from '../src/config/db.js';

const addJobTitleColumn = async () => {
    try {
        const query = `
            ALTER TABLE Users 
            ADD COLUMN IF NOT EXISTS job_title VARCHAR(100);
        `;
        await pool.query(query);
        console.log("✅ Successfully added 'job_title' column to Users table.");
    } catch (error) {
        console.error("❌ Error adding column:", error);
    } finally {
        pool.end();
    }
};

addJobTitleColumn();
