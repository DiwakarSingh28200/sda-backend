import { db } from "../config/db"
import { v4 as uuidv4 } from "uuid"
const uuid = uuidv4().replace(/\D/g, "")
const randomDigits = uuid.slice(0, 4)

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

    if (parentDealerError || !parentDealer?.dealer_id) {
      throw new Error("Invalid parent dealer")
    }

    const masterIdPrefix = parentDealer.dealer_id.replace(/M$/, "")

    const { data: existingSubs, error } = await db
      .from("dealers")
      .select("dealer_id")
      .ilike("dealer_id", `${masterIdPrefix}S%`)

    if (error) throw new Error("Failed to fetch sub-dealers")

    const subIndex = (existingSubs?.length || 0) + 1
    const subSuffix = String(subIndex).padStart(2, "0")
    return `${masterIdPrefix}S${subSuffix}` // e.g. DLTVS8374S01
  }

  // Generate unique random 4-digit number for master dealer
  let finalDealerId = ""
  let attempts = 0

  while (attempts < 5) {
    const rand = randomDigits // e.g., 8374
    const candidate = `${basePrefix}${rand}M`

    const { data: existing, error } = await db
      .from("dealers")
      .select("id")
      .eq("dealer_id", candidate)
      .maybeSingle()

    if (!existing) {
      finalDealerId = candidate
      break
    }

    attempts++
  }

  if (!finalDealerId) {
    throw new Error("Failed to generate unique dealer ID after 5 attempts")
  }

  return finalDealerId
}

export async function generateDealerEmployeeId(dealerId: string): Promise<string> {
  const isMasterDealer = dealerId.endsWith("M")
  const baseId = isMasterDealer ? dealerId.replace(/M$/, "") : dealerId

  const prefix = `${baseId}E` // e.g. DLTVS8374E or DLTVS8374S01E

  const { data: existingEmployees } = await db
    .from("dealer_employees")
    .select("employee_id")
    .ilike("employee_id", `${prefix}%`)

  const nextIndex = (existingEmployees?.length || 0) + 1
  const padded = String(nextIndex).padStart(3, "0")

  return `${prefix}${padded}` // e.g. DLTVS8374E001 or DLTVS8374S01E001
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
