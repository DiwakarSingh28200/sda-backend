import express, { Application, Request, Response, NextFunction } from "express";  
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import logger from "./config/logger";
import cookieParser from "cookie-parser";
import apiV1Routes from "./routes/v1"; 
const allowedOrigins = ["https://www.vinaydemos.site", "https://suredrive-assist-app.vercel.app", "http://localhost:3000"];
const app: Application = express(); 
app.use(cookieParser()); 

// Global Middleware
app.use(express.json()); // Parse JSON requests
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded requests
app.use(cors({
  // origin: [frontendUrl],
  origin: (origin, callback) => {
    console.log("Origin:", origin);
    console.log("Allowed Origins:", allowedOrigins);
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, origin);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
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
