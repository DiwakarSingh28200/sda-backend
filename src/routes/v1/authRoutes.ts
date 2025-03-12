import { Router } from "express";
import { loginEmployee, logoutEmployee } from "../../controllers/authController";

const router: Router = Router();

router.post("/login", loginEmployee);
router.post("/logout", logoutEmployee);

export default router;
