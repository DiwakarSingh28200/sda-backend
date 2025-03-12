import { Router } from "express";
import departmentRoutes from "./departmentRoutes";
import roleRoutes from "./roleRoutes";
import authRoutes from "./authRoutes";

const router = Router();

router.use("/departments", departmentRoutes);
router.use("/roles", roleRoutes);
// router.use("/employees", employeeRoutes);
router.use("/auth", authRoutes);
// router.use("/dealers", dealerRoutes); // Future
// router.use("/customers", customerRoutes); // Future

export default router;
