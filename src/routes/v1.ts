import { Router } from "express"
import authRoutes from "../modules/internal/auth/auth.routes"
import walletRoutes from "../modules/internal/wallet/wallet.routes"
import employeeRoutes from "../modules/internal/employee/employee.router"
import dealerRoutes from "../modules/internal/dealer/dealer.routes"
// import dealerRoutes from "@/modules/dealer/dealer.routes";
// import { authenticateEmployee } from "@/middleware/authMiddleware";

const router = Router()

router.use("/auth", authRoutes) // public routes
router.use("/employees", employeeRoutes)
router.use("/dealers", dealerRoutes)
// router.use(authenticateEmployee); // protect below
// router.use("/dealers", dealerRoutes);

router.use("/wallet", walletRoutes)

export default router
