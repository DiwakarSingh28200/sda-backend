import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import pino from "pino-http";
import logger from "./config/logger";


import apiV1Routes from "./routes/v1"; // Import versioned routes


const app: Application = express(); 

// Global Middleware
app.use(express.json()); // Parse JSON requests
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded requests
app.use(cors()); // Enable CORS
app.use(helmet()); // Secure HTTP headers
app.use(compression()); // Enable response compression
app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    logger.info(`${req.method} ${req.originalUrl} | ${res.statusCode} | ${Date.now() - start}ms`);
  });

  next();
});


app.use("/api/v1", apiV1Routes);

export default app;
