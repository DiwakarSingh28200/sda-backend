import express, { Application, Request, Response, NextFunction } from "express"
import cors from "cors"
import helmet from "helmet"
import compression from "compression"
import logger from "./config/logger"
import cookieParser from "cookie-parser"
import internalRoutes from "./routes/v1"
import dealerRoutes from "./routes/dealer-v1"
import zohoRoutes from "./routes/zoho"

const frontendUrl = process.env.FRONTEND_URL!
const frontendDevUrl = process.env.FRONTEND_DEV_URL!

const allowedOrigins = [
  frontendUrl,
  frontendDevUrl,
  "http://localhost:3000",
  "https://hoppscotch.io",
  "https://sda.vinaydemos.site",
]
const app: Application = express()
app.use(cookieParser())

// Global Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(
  cors({
    origin: (origin, callback) => {
      console.log("Origin:", origin)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, origin)
      } else {
        callback(new Error("Not allowed by CORS"))
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
)
app.use(helmet())
app.use(compression())

app.use((req, res, next) => {
  const start = Date.now()
  res.on("finish", () => {
    logger.info(`${req.method} ${req.originalUrl} | ${res.statusCode} | ${Date.now() - start}ms`)
  })
  next()
})

app.use("/api/v1", internalRoutes)
app.use("/api/dealer/v1", dealerRoutes)
app.use("/api/zoho", zohoRoutes)
app.use("/api/v1/razorpay/webhook", express.raw({ type: "application/json" }))

export default app
