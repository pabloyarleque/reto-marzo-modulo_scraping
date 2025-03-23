import express from 'express';
import cors from 'cors';

export function createServer() {
    const app = express();

    // Middlewares
    app.use(cors());
    app.use(express.json());

    return app;
}