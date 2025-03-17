import { Router } from "express";
import { loginEmployee, getAllEmployees, getLoggedInUser, logoutEmployee } from "../../controllers/authController";
import { asyncHandler } from "../../middleware/asyncHandler";
import { authenticateEmployee } from "../../middleware/authMeddleware";

const router: Router = Router();

router.post("/login", asyncHandler(loginEmployee));
router.get("/employees", asyncHandler(getAllEmployees));
router.get("/me", asyncHandler(authenticateEmployee), asyncHandler(getLoggedInUser));
router.post("/logout", asyncHandler(logoutEmployee));


export default router;
