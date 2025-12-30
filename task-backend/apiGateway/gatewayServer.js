import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import morgan from 'morgan';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.GATEWAY_PORT || 5000;

app.use(morgan('dev'));
app.use(cors());

const services = [
    {
        path: '/api/ai',
        target: process.env.AI_SERVICE_URL || 'http://localhost:8001',
        pathRewrite: {
            '^/api/ai': '', // Strip /api/ai prefix when forwarding to FastAPI (e.g. /api/ai/query -> /query)
        }
    },
    {
        path: '/api',
        target: process.env.NODE_SERVICE_URL || 'http://localhost:5001',
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