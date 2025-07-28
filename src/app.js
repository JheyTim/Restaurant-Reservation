import express from 'express';
import helmet from 'helmet';
import cors from 'cors';

const app = express();

// Global middleware
app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN ?? '*' }));
app.use(express.json());

export default app;
