import { z } from "zod"

export const EmployeeOnboardingSchema = z.object({
  first_name: z.string(),
  last_name: z.string(),
  email: z.string(),
  phone: z.string(),
  dob: z.string(),
  gender: z.string(),
  address: z.string(),
  aadhar_id: z.string(),
  pancard: z.string(),
  bank_account: z.string(),
  ifsc_code: z.string(),
  emergency_contact: z.string(),
  department_id: z.string(),
  employment_type: z.string(),
  role_id: z.string(),
  salary: z.number(),
  tax_deductions: z.number(),
  provident_fund: z.number(),
  reporting_manager: z.string(),
  created_by: z.string(),
})

// Provide me sample payload
const samplePayload = {
  first_name: "John",
  last_name: "Doe",
  email: "john.doe@example.com",
  phone: "1234567890",
  dob: "1990-01-01",
  gender: "male",
  address: "123 Main St, Anytown, USA",
  aadhar_id: "123456789012",
  pancard: "ABCDE1234F",
  bank_account: "1234567890",
  ifsc_code: "1234567890",
  employment_type: "full-time",
  emergency_contact: "1234567890",
  department_id: "e73a3049-7562-42ba-bccb-6454c05ca9bd",
  role_id: "944050d9-e778-4f36-90d2-de7f26764c05",
  salary: 100000,
  tax_deductions: 10000,
  provident_fund: 10000,
  reporting_manager: "e6161539-e682-4599-9c79-2ed71ff2a1bc",
  created_by: "e6161539-e682-4599-9c79-2ed71ff2a1bc",
}

export type EmployeeOnboardingPayload = z.infer<typeof EmployeeOnboardingSchema>
