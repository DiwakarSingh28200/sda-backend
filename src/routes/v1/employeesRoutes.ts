import { Router } from "express";
import { createEmployee, getAllEmployees, getEmployeeRoles, getEmployeeById } from "../../controllers/employeesController";
import { asyncHandler } from "../../middleware/asyncHandler";
import { authenticateEmployee } from "../../middleware/authMeddleware";


const router: Router = Router();

router.post("/onboarding", asyncHandler(authenticateEmployee),asyncHandler(createEmployee));
router.get("/", asyncHandler(getAllEmployees));
router.get("/:employee_id", asyncHandler(getEmployeeById));
router.get("/:employee_id/roles", asyncHandler(getEmployeeRoles));
export default router;
