import { db } from "../config/db"

export async function generateDealerId({
  state,
  oemCode,
  isSubDealer = false,
  parentDealerId,
}: {
  state: string
  oemCode: string
  isSubDealer?: boolean
  parentDealerId?: string
}): Promise<string> {
  const normalizedState = state
    .trim()
    .replace(/\s+/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase())

  const stateCode = STATE_CODE_MAP[normalizedState]
  if (!stateCode) throw new Error(`State code not found for: ${state}`)

  const basePrefix = `${stateCode}${oemCode.toUpperCase()}`

  if (isSubDealer) {
    if (!parentDealerId) throw new Error("Parent dealer ID is required for sub-dealer")
    const { data: parentDealer, error: parentDealerError } = await db
      .from("dealers")
      .select("dealer_id")
      .eq("id", parentDealerId)
      .single()

    const masterIdPrefix = parentDealer?.dealer_id?.replace(/M$/, "")

    // Get existing sub-dealers under this master dealer
    const { data: existingSubs, error } = await db
      .from("dealers")
      .select("dealer_id")
      .ilike("dealer_id", `${masterIdPrefix}S%`)

    if (error) throw new Error("Failed to fetch sub-dealers")

    const subIndex = (existingSubs?.length || 0) + 1
    const subSuffix = String(subIndex).padStart(2, "0")
    return `${masterIdPrefix}S${subSuffix}` // e.g. DLTVS001S01
  }

  // For master dealers: Get next available sequence
  const { data: existingMasters, error } = await db
    .from("dealers")
    .select("dealer_id")
    .ilike("dealer_id", `${basePrefix}%M`)

  if (error) throw new Error("Failed to fetch master dealers")

  const nextIndex = (existingMasters?.length || 0) + 1
  const masterSuffix = String(nextIndex).padStart(3, "0")
  return `${basePrefix}${masterSuffix}M` // e.g. DLTVS001M
}

// Example: dealerId is like "DLTVS005M"
export async function generateDealerEmployeeId(dealerId: string): Promise<string> {
  // Determine prefix
  const isMasterDealer = dealerId.endsWith("M")
  const baseId = isMasterDealer ? dealerId.replace(/M$/, "") : dealerId // DLTVS001 or DLTVS001S01

  const prefix = `${baseId}E` // e.g. DLTVS001E or DLTVS001S01E

  // Search for existing employees starting with this prefix
  const { data: existingEmployees } = await db
    .from("dealer_employees")
    .select("employee_id")
    .ilike("employee_id", `${prefix}%`)

  const nextIndex = (existingEmployees?.length || 0) + 1
  const padded = String(nextIndex).padStart(3, "0")

  return `${prefix}${padded}` // e.g. DLTVS001E001 or DLTVS001S01E001
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
