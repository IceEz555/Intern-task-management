import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import morgan from 'morgan';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const app = express();
const PORT = process.env.GATEWAY_PORT;

app.use(morgan('dev'));
app.use(cors());

const services = [
    {
        path: '/api/ai', // ถ้าขึ้นต้นด้วยนี้
        target: process.env.AI_SERVICE_URL,
        pathRewrite: {
            '^/api/ai': '', // Strip /api/ai prefix
        }
        // Note: Currently unused by Streamlit (which talks directly to FastAPI on Port 8000).
        // Reserved for future React-based Chat Widget.
    },
    {
        path: '/api',
        target: process.env.NODE_SERVICE_URL,
        pathRewrite: {
            '^/': '/api/', // Add /api prefix back because Node backend expects it (e.g. /login -> /api/login)
        }
    }
];

services.forEach(service => {
    app.use(service.path, createProxyMiddleware({
        target: service.target,
        changeOrigin: true,
        pathRewrite: service.pathRewrite, // Use the specific pathRewrite from config
        onError: (err, req, res) => {
            // ถ้าปลายทาง(Server Down) ให้ส่ง response กลับไปให้กับ Client
            console.error(`Proxy Error (${service.path}):`, err.message);
            res.status(502).json({ error: 'Service Unavailable', message: err.message });
        }
    }));
});

app.listen(PORT, () => {
    console.log(`API Gateway is running on port ${PORT}`);
});