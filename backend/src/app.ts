import express from 'express';
import cors from 'cors';
import { globalErrorHandler } from './middleware/errorHandler';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes (to be added)
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
});

// Global Error Handler
app.use(globalErrorHandler);

export default app;
