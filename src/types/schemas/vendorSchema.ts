import { z } from "zod"

// Reusable
const LocationSchema = z.object({
  region: z.string(),
  city: z.string(),
  latitude: z.number(),
  longitude: z.number(),
})

const ServiceSchema = z.object({
  category: z.string(),
  repair_on_site: z.boolean(),
})

const PricingSchema = z.object({
  price_per_service: z.number(),
  price_per_additional_km: z.number(),
  repair_on_site_price: z.number().nullable(),
  night_charges: z.number(),
  night_charges_towing: z.number(),
  price_list_file_path: z.string().nullable(),
  notes: z.string().nullable(),
})

const OperationSchema = z.object({
  service_description: z.string(),
  response_time: z.string(),
  certifications_file_path: z.string().nullable(),
  coverage_km: z.number(),
  estimated_arrival_time_minutes: z.number(),
  is_24x7: z.boolean(),
  time_start: z.string().nullable(),
  time_end: z.string().nullable(),
  available_days: z.array(z.string()),
})

const ContactSchema = z.object({
  support_contact_number: z.string(),
  support_contact_email: z.string(),
  prefers_email: z.boolean(),
  prefers_sms: z.boolean(),
  finance_contact_name: z.string(),
  finance_contact_email: z.string(),
  finance_contact_number: z.string(),
})

const DocumentSchema = z.object({
  pan_number: z.string(),
  gst_number: z.string(),
  gst_certificate_file_path: z.string(),
  pan_card_file_path: z.string(),
  address_proof_file_path: z.string(),
  cancelled_cheque_file_path: z.string(),
})

export const CreateVendorSchema = z.object({
  vendor: z.object({
    type: z.string(),
    name: z.string(),
    address: z.string(),
    city: z.string(),
    state: z.string(),
    pincode: z.string(),
    primary_contact_name: z.string(),
    primary_contact_number: z.string(),
    primary_email: z.string().email(),
    status: z.string().default("approved"),
    location_url: z.string(),
  }),
  services: z.array(ServiceSchema),
  operatingAreas: z.array(LocationSchema),
  pricing: PricingSchema,
  operations: OperationSchema,
  contacts: ContactSchema,
  documents: DocumentSchema,
})

export type CreateVendorInput = z.infer<typeof CreateVendorSchema>
