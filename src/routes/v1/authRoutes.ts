import { Router } from "express";
import { loginEmployee} from "../../controllers/authController";
import { asyncHandler } from "../../middleware/asyncHandler";

const router: Router = Router();

router.post("/login", asyncHandler(loginEmployee));


export default router;
