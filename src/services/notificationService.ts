import { db } from "../config/db"
import { Database } from "../types/supabase" // ⬅️ adjust path accordingly

type NotificationInsert = Database["public"]["Tables"]["notifications"]["Insert"]

type CreateNotificationInput = {
  recipient_id: string
  sender_id?: string
  type: NotificationInsert["type"]
  message: string
  reference_id?: string
  metadata?: Record<string, any>
}

export const createNotification = async ({
  recipient_id,
  sender_id = "",
  type,
  message,
  reference_id = "",
  metadata = {},
}: CreateNotificationInput) => {
  const payload: NotificationInsert = {
    recipient_id,
    sender_id,
    type,
    message,
    reference_id,
    metadata,
    is_read: false,
    is_archived: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }

  const { error } = await db.from("notifications").insert(payload)

  if (error) {
    throw new Error(`Notification insert failed: ${error.message}`)
  }
}

export const getUserNotifications = async (userId: string) => {
  const { data, error } = await db
    .from("notifications")
    .select(
      `
        id,
        type,
        message,
        is_read,
        created_at,
        reference_id,
        metadata,
        sender:sender_id(id, first_name, last_name)
      `
    )
    .eq("recipient_id", userId)
    .order("created_at", { ascending: false })

  if (error) {
    throw new Error(`Failed to fetch notifications: ${error.message}`)
  }

  return data
}

export const markNotificationAsRead = async (notificationId: string) => {
  const { error } = await db
    .from("notifications")
    .update({
      is_read: true,
      updated_at: new Date().toISOString(),
    })
    .eq("id", notificationId)

  if (error) {
    throw new Error(`Failed to mark as read: ${error.message}`)
  }
}
