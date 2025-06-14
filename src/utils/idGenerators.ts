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

export async function generateVendorId({ state }: { state: string }): Promise<string> {
  const normalizedState = state
    .trim()
    .replace(/\s+/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase())

  const stateCode = STATE_CODE_MAP[normalizedState]
  if (!stateCode) throw new Error(`State code not found for: ${state}`)

  const uuid = uuidv4().replace(/\D/g, "")
  const uniquePart = uuid.slice(0, 4)
  return `VND${stateCode}${uniquePart}` // VNDDL0004
}

export const STATE_CODE_MAP: Record<string, string> = {
  "Andhra Pradesh": "AP",
  "Arunachal Pradesh": "AR",
  Assam: "AS",
  Bihar: "BR",
  Chhattisgarh: "CG",
  Goa: "GA",
  Gujarat: "GJ",
  Haryana: "HR",
  "Himachal Pradesh": "HP",
  "Jammu and Kashmir": "JK",
  Jharkhand: "JH",
  Karnataka: "KA",
  Kerala: "KL",
  "Madhya Pradesh": "MP",
  Maharashtra: "MH",
  Manipur: "MN",
  Meghalaya: "ML",
  Mizoram: "MZ",
  Nagaland: "NL",
  Orissa: "OR",
  Punjab: "PB",
  Rajasthan: "RJ",
  Sikkim: "SK",
  "Tamil Nadu": "TN",
  Tripura: "TR",
  Uttarakhand: "UK",
  "Uttar Pradesh": "UP",
  "West Bengal": "WB",
  "Andaman and Nicobar Islands": "AN",
  Chandigarh: "CH",
  "Dadra and Nagar Haveli": "DH",
  "Daman and Diu": "DD",
  Delhi: "DL",
  Lakshadweep: "LD",
  Pondicherry: "PY",
}
