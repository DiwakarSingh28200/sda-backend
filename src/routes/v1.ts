import { Router } from "express"
import authRoutes from "../modules/internal/auth/auth.routes"
import walletRoutes from "../modules/internal/wallet/wallet.routes"
// import dealerRoutes from "@/modules/dealer/dealer.routes";
// import { authenticateEmployee } from "@/middleware/authMiddleware";

const router = Router()

router.use("/auth", authRoutes) // public routes
// router.use(authenticateEmployee); // protect below
// router.use("/dealers", dealerRoutes);

router.use("/wallet", walletRoutes)

export default router
