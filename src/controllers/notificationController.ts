import { Request, Response } from "express"
import { db } from "../config/db"
import { ApiResponse } from "../types/apiResponse"
import { getUserNotifications, markNotificationAsRead } from "../services/notificationService"

export const getMyNotifications = async (req: Request, res: Response<ApiResponse<any>>) => {
  try {
    const userId = req.user?.id
    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" })

    const data = await getUserNotifications(userId)
    return res.json({ success: true, message: "Notifications fetched", data })
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Failed to fetch notifications", error: error as string })
  }
}

export const markAsRead = async (req: Request, res: Response<ApiResponse<null>>) => {
  try {
    const { id } = req.params
    await markNotificationAsRead(id)
    return res.json({ success: true, message: "Notification marked as read" })
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Failed to update", error: error as string })
  }
}
