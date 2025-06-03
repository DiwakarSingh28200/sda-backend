"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateEmployee = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authenticateEmployee = (req, res, next) => {
    try {
        const token = req.cookies.access_token;
        if (!token) {
            res.status(401).json({ success: false, message: "Unauthorized: No token" });
            return;
        }
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch (err) {
        res.status(401).json({ success: false, message: "Invalid token" });
    }
};
exports.authenticateEmployee = authenticateEmployee;
