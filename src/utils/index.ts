import { v4 as uuidv4 } from "uuid"

export const generateEmployeeId = (): string => {
  const uuid = uuidv4().replace(/[^0-9]/g, "")
  const randomDigits = uuid.slice(0, 5)
  return `1${randomDigits}`
}
