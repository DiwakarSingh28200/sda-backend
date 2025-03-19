import express from "express";
import { getAllEmployees, getEmployeeById } from "../../controllers/employeeController";
import { asyncHandler } from "../../middleware/asyncHandler";

const router = express.Router();

router.get("/", asyncHandler(getAllEmployees));
router.get("/:id", asyncHandler(getEmployeeById));

export default router;
