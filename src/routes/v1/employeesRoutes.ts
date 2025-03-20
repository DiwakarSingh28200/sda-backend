import { Router } from "express";
import { createEmployee, getAllEmployees } from "../../controllers/employeesController";
import { asyncHandler } from "../../middleware/asyncHandler";


const router: Router = Router();

router.post("/onboarding", asyncHandler(createEmployee));
router.get("/", asyncHandler(getAllEmployees));
export default router;
