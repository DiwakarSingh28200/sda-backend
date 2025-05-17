"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const logger_1 = __importDefault(require("./config/logger"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const v1_1 = __importDefault(require("./routes/v1"));
const dealer_v1_1 = __importDefault(require("./routes/dealer-v1"));
const frontendUrl = process.env.FRONTEND_URL;
const frontendDevUrl = process.env.FRONTEND_DEV_URL;
const allowedOrigins = [frontendUrl, frontendDevUrl, "http://localhost:3000", "https://hoppscotch.io"];
const app = (0, express_1.default)();
app.use((0, cookie_parser_1.default)());
// Global Middleware
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        console.log("Origin:", origin);
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, origin);
        }
        else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use((0, helmet_1.default)());
app.use((0, compression_1.default)());
app.use((req, res, next) => {
    const start = Date.now();
    res.on("finish", () => {
        logger_1.default.info(`${req.method} ${req.originalUrl} | ${res.statusCode} | ${Date.now() - start}ms`);
    });
    next();
});
app.use("/api/v1", v1_1.default);
app.use("/api/dealer/v1", dealer_v1_1.default);
exports.default = app;
