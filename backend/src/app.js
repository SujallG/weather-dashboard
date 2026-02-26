import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import * as rateLimit from "./middlewares/rateLimiter.js";
import errorHandler from "./middlewares/errorHandler.js";
import connectDB from "./config/database.js";

import authRoutes from "./features/auth/routes.js";
import weatherRoutes from "./features/weatherService/routes.js";
import userRoutes from "./features/user/routes.js";

const app = express();

connectDB();

app.use(cors());

// app.use('/api', rateLimit.general);

app.use(express.json());
app.use(express.urlencoded({ extended: true}));

// Routes
app.use((req, res, next) => {
  console.log("New request:", req.method, req.url);
  next();
});
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/weather', weatherRoutes);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date() });
});

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.use(errorHandler);

export default app;