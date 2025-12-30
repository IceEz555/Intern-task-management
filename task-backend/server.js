import app from './src/app.js';
import dotenv from 'dotenv';

dotenv.config();

const port = 8000;

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
