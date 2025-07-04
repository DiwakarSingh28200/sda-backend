import { z } from "zod"

// Reusable
const LocationSchema = z.object({
  region: z.string(),
  city: z.string(),
  location: z.string(),
  latitude: z.number(),
  longitude: z.number(),
  vehicles: z.array(z.string()).optional(),
})

const ServiceSchema = z.object({
  service_name: z.string(),
  night_charge: z.number().optional(),
  day_charge: z.number().optional(),
  fixed_distance_charge: z.number().optional(),
  additional_price: z.number().optional(),
})

const ContactSchema = z.object({
  finance_contact_name: z.string().optional(),
  finance_contact_email: z.string().optional(),
  finance_contact_number: z.string().optional(),
})

const DocumentSchema = z.object({
  pan_number: z.string(),
  gst_number: z.string().optional(),
  gst_certificate_file_path: z.string().optional(),
  pan_card_file_path: z.string(),
  address_proof_file_path: z.string().optional(),
  cancelled_cheque_file_path: z.string().optional(),
})

const BankInfoSchema = z.object({
  bank_name: z.string(),
  account_number: z.string(),
  account_holder_name: z.string(),
  ifsc_code: z.string(),
  cancelled_cheque_file_path: z.string(),
})

const VendorFleetSchema = z.object({
  vehicle_registration_number: z.string(),
  vehicle_type: z.string(),
})

export const CreateVendorSchema = z.object({
  vendor: z.object({
    name: z.string(),
    address: z.string(),
    city: z.string(),
    state: z.string(),
    pincode: z.string(),
    primary_contact_name: z.string(),
    primary_contact_number: z.string(),
    primary_email: z.string().email(),
    location_url: z.string(),
    is_24x7: z.boolean().optional(),
    time_start: z.string().optional(),
    time_end: z.string().optional(),
    available_days: z.array(z.string()),
    price_list_file_path: z.string().optional(),
    repair_on_site: z.boolean(),
    remark: z.string().optional(),
    remark_title: z.string().optional(),
    due_date: z.string().optional(),
    owner_name: z.string(),
    owner_contact_number: z.string(),
    owner_email: z.string().email(),
    owner_whatsapp: z.string(),
  }),
  services: z.array(ServiceSchema),
  operatingAreas: z.array(LocationSchema),
  bankInfo: BankInfoSchema,
  contacts: ContactSchema,
  documents: DocumentSchema,
  fleet: z.array(VendorFleetSchema),
})

export type CreateVendorInput = z.infer<typeof CreateVendorSchema>
