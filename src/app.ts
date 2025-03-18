import express, { Application, Request, Response, NextFunction } from "express";  
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import logger from "./config/logger";
import cookieParser from "cookie-parser";
import apiV1Routes from "./routes/v1"; 


const app: Application = express(); 
app.use(cookieParser()); 

// Global Middleware
app.use(express.json()); // Parse JSON requests
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded requests

const setCorsHeaders = (req: Request, res: Response, next: NextFunction): void => {   
  res.setHeader("Access-Control-Allow-Origin", process.env.FRONTEND_URL || "http://localhost:3000");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    res.sendStatus(204);
    return;
  }

  next();
};

app.use(setCorsHeaders);

app.use(cors({
  origin: [
    process.env.FRONTEND_URL || "http://localhost:3000", 
  ], 
  credentials: true, 
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], 
  allowedHeaders: ["Content-Type", "Authorization"], 

  })
);
app.use(helmet()); // Secure HTTP headers
app.use(compression());
app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    logger.info(`${req.method} ${req.originalUrl} | ${res.statusCode} | ${Date.now() - start}ms`);
  });

  next();
});


app.use("/api/v1", apiV1Routes);

export default app;
