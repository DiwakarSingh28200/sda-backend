import { v4 as uuidv4 } from "uuid"

export const generateDealerId = (): string => {
  const uuid = uuidv4().replace(/\D/g, "") // only digits
  const uniquePart = uuid.slice(0, 4) // 4-digit portion
  return `DLR${uniquePart}`
}

export const generateDealerEmployeeId = (
  dealerNumeric: string // from `dealerId.replace("DLR", "")`
): string => {
  const uuid = uuidv4().replace(/\D/g, "")
  const suffix = uuid.slice(0, 2) // 2-digit random
  return `E${dealerNumeric}${suffix}`
}
