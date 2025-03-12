import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import pino from "pino-http";
import { db } from "./config/db";

import apiV1Routes from "./routes/v1"; // Import versioned routes


const app: Application = express(); 

// Global Middleware
app.use(express.json()); // Parse JSON requests
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded requests
app.use(cors()); // Enable CORS
app.use(helmet()); // Secure HTTP headers
app.use(compression()); // Enable response compression
app.use(pino()); // Modern request logging


app.use("/api/v1", apiV1Routes);

export default app;
