import { Router } from "express";
import { createEmployee, getAllEmployees } from "../../controllers/employeesController";
import { asyncHandler } from "../../middleware/asyncHandler";
import { authenticateEmployee } from "../../middleware/authMeddleware";


const router: Router = Router();

router.post("/onboarding", asyncHandler(authenticateEmployee),asyncHandler(createEmployee));
router.get("/", asyncHandler(getAllEmployees));
export default router;
