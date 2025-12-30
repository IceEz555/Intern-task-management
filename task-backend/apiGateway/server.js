import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import morgan from 'morgan';
import cors from 'cors';

const app = express();
const PORT = process.env.GATEWAY_PORT || 5000;

// Middleware สำหรับ Log requests
app.use(morgan('dev'));
app.use(cors());

// กำหนด Service Routes (Proxy Configuration)
// ในระบบ Microservice จริง targets เหล่านี้จะมาจาก Environment Variables
const services = [
    {
        path: '/api/auth',
        target: 'http://localhost:5001', // Auth Service
    },
    {
        path: '/api/tasks',
        target: 'http://localhost:5002', // Task/Project Service
    },
    {
        path: '/api/projects',
        target: 'http://localhost:5002', // Task/Project Service
    },
    {
        path: '/api/users',
        target: 'http://localhost:5003', // User Service
    }
];

// ตั้งค่า Proxy สำหรับแต่ละ service
services.forEach(service => {
    app.use(service.path, createProxyMiddleware({
        target: service.target,
        changeOrigin: true,
        pathRewrite: {
            [`^${service.path}`]: service.path,
        },
        onError: (err, req, res) => {
            console.error(`Proxy Error (${service.path}):`, err.message);
            res.status(502).json({ error: 'Service Unavailable', message: err.message });
        }
    }));
});

// Health check endpoint สำหรับ Gateway
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'Gateway is running',
        timestamp: new Date().toISOString(),
        services: services.map(s => s.path)
    });
});

app.listen(PORT, () => {
    console.log(`🚀 API Gateway is running on http://localhost:${PORT}`);
    console.log(`📡 Registered routes:`, services.map(s => s.path).join(', '));
});
