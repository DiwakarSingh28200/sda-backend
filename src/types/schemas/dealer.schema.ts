import { z } from "zod"

// 🔹 Core Dealer Info
export const DealerSchema = z.object({
  dealership_type: z.string().optional(),
  dealership_name: z.string().min(1, "Dealership name is required"),
  registered_address: z.string().min(1, "Address is required"),
  city: z.string().min(1),
  state: z.string().min(1),
  pincode: z.string().min(1),
  gps_location: z.string().optional(),
  operations_contact_name: z.string().min(1),
  operations_contact_phone: z.string().min(10),
  email: z.string().email("Invalid email"),
  owner_name: z.string().min(1),
  owner_contact: z.string().min(10),
  owner_email: z.string().email(),
  escalation_name: z.string().optional(),
  escalation_contact: z.string().optional(),
  escalation_email: z.string().optional(),
  pan_number: z.string().min(6, "PAN number must be 6 characters"),
  gst_number: z.string().min(1),
  vehicle_types: z.array(z.string()).optional(),
  is_rsa_support: z.boolean().optional(),
  parent_dealer_id: z.string().optional(),
  is_sub_dealer: z.boolean().optional(),
  is_master_dealer: z.boolean().optional(),
  is_email_verified: z.boolean().optional(),
  is_contact_verified: z.boolean().optional(),
  oems: z.array(z.string()).optional(),
})

// 🔹 Services
export const ServiceSchema = z.object({
  rsa_support: z.boolean().optional(),
  operation_location: z.string().optional(),
  price_per_service: z.number().optional(),
  price_per_km: z.number().optional(),
  repair_on_site: z.boolean().optional(),
  repair_price: z.number().optional(),
  night_price: z.number().optional(),
  price_list_file: z.string().optional(),
  fixed_distance_charge: z.number().optional(),
  is_24x7: z.boolean().optional(),
  time_start: z.string().optional(),
  time_end: z.string().optional(),
  available_days: z.array(z.string()).optional(),
})

// 🔹 OEMs (vehicle_segment is optional as per frontend)
export const OemSchema = z.object({
  oem_name: z.string().min(1),
  vehicle_segment: z.string().optional(),
})

// 🔹 Documents
export const DocumentsSchema = z.object({
  gst_certificate: z.string().url(),
  pan_card_file: z.string().url(),
  address_proof: z.string().url(),
})

// 🔹 Finance Info
export const FinanceInfoSchema = z.object({
  bank_name: z.string().min(1),
  account_number: z.string().min(6),
  ifsc_code: z.string().min(6),
  finance_contact_name: z.string().min(1),
  finance_contact_email: z.string().email(),
  finance_contact_phone: z.string().min(10),
  cancelled_cheque_file: z.string().url(),
})

// 🔹 Sub Dealerships
export const SubDealershipSchema = z.object({
  name: z.string().min(1),
  contact: z.string().min(10),
  address: z.string().min(1),
  oems: z.array(z.string().min(1)).min(1),
})

// 🔹 Employees
export const EmployeeSchema = z.object({
  name: z.string().min(1),
  role: z.string().optional(),
  contact_number: z.string().optional(),
  email: z.string().optional(),
})

// 🔹 Full Dealer Onboarding Payload
export const DealerOnboardingSchema = z.object({
  dealer: DealerSchema,
  services: z.array(ServiceSchema).optional(),
  documents: DocumentsSchema,
  finance_info: FinanceInfoSchema,
  sub_dealerships: z.array(SubDealershipSchema).optional(),
  employees: z.array(EmployeeSchema).optional(),
})

export type DealerOnboardingPayload = z.infer<typeof DealerOnboardingSchema>
