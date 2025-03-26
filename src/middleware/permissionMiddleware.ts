import { Request, Response, NextFunction } from "express"
import { hasPermission, hasRole } from "../utils/permissions"
import { ApiResponse } from "../types/apiResponse"

export const requirePermissions = (permissions: string[]) => {
  return (req: Request, res: Response<ApiResponse<any>>, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Unauthorized" })
    }

    if (!hasPermission(req.user.permissions, permissions)) {
      return res
        .status(403)
        .json({ success: false, message: "Access denied. Missing permission." })
    }

    next()
  }
}

export const requireRoles = (roles: string[]) => {
  return (req: Request, res: Response<ApiResponse<any>>, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Unauthorized" })
    }

    if (!hasRole(req.user.roles, roles)) {
      return res.status(403).json({ success: false, message: "Access denied. Insufficient role." })
    }

    next()
  }
}
