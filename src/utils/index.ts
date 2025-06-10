import { v4 as uuidv4 } from "uuid"

export const zodErrorFormatter = (path: string[]) => {
  const field = path[path.length - 1]
  return field
    .replace(/_/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/\b\w/g, (l) => l.toUpperCase()) // capitalize
}

export const generateEmployeeId = (): string => {
  const uuid = uuidv4().replace(/[^0-9]/g, "")
  const randomDigits = uuid.slice(0, 5)
  return `1${randomDigits}`
}
