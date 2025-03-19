import { Router } from "express";
import departmentRoutes from "./departmentRoutes";
import roleRoutes from "./roleRoutes";
import authRoutes from "./authRoutes";
import permissionRoutes from "./permissionRoutes";
import employeeRoleRoutes from "./employeeRoleRoutes"; 
import rolePermissionRoutes from "./rolePermissionRoutes";
import employeeRoutes from "./employeeRoutes";



const router = Router();

router.use("/departments", departmentRoutes);
router.use("/roles", roleRoutes);
router.use("/permissions", permissionRoutes);
router.use("/employee-roles", employeeRoleRoutes);
router.use("/role-permissions", rolePermissionRoutes); 
router.use("/employees", employeeRoutes);

router.use("/auth", authRoutes);
// router.use("/dealers", dealerRoutes); // Future
// router.use("/customers", customerRoutes); // Future

export default router;
