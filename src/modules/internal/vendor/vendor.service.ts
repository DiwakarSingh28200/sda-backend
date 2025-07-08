import { db } from "../../../config/db"
import { VendorOnboardingPayload } from "./vendor.type"
import { generateVendorId } from "../../../utils/idGenerators"
import bcrypt from "bcrypt"
import axios from "axios"

export const createVendor = async (input: VendorOnboardingPayload, createdBy: string) => {
  const { vendor, services, operatingAreas, contacts, documents, bankInfo, fleet } = input

  // check if vendor already exists
  const { data: existingVendor } = await db
    .from("vendors")
    .select("id")
    .ilike("name", vendor.name!)
    .single()

  // check if vendor already with gst number
  const { data: existingVendorWithGst } = await db
    .from("vendor_documents")
    .select("id")
    .eq("gst_number", documents.gst_number!)
    .single()

  if (existingVendorWithGst) {
    throw new Error("Vendor already exists with gst number")
    return
  }

  if (existingVendor) {
    throw new Error("Vendor already exists")
    return
  }

  const vendorId = await generateVendorId({ state: vendor.state! })

  const tempPassword = "Vendor@1234"
  const hashedPassword = await bcrypt.hash(tempPassword, 10)

  // Insert into vendors
  const { data: vendorInsert, error: vendorError } = await db
    .from("vendors")
    .insert([
      {
        ...vendor,
        vendor_id: vendorId,
        password: hashedPassword,
        login_enabled: false,
        is_active: false,
        created_by: createdBy,
        status: "pending",
        due_date: null,
      },
    ])
    .select("id")
    .single()

  if (vendorError) throw vendorError
  const vendor_id = vendorInsert.id

  if (!vendor_id) throw new Error("Failed to create vendor" + vendorError)

  // Insert services
  if (services.length) {
    const servicePayload = services.map((s) => ({
      ...s,
      vendor_id,
    }))

    const { error: serviceError } = await db.from("vendor_services").insert(servicePayload)
    if (serviceError) throw serviceError
  }

  // Insert operating areas
  if (operatingAreas.length) {
    const areaPayload = operatingAreas.map((a) => ({
      vendor_id,
      region: a.region,
      city: a.city,
      latitude: a.latitude,
      longitude: a.longitude,
      location: `SRID=4326;POINT(${a.longitude} ${a.latitude})`,
      state: vendor.state,
      contact_number: vendor.primary_contact_number,
      vehicles: a.vehicles ?? [],
    }))
    const { error: areaError } = await db.from("vendor_operating_areas").insert(areaPayload)
    if (areaError) throw areaError
  }

  // Insert bank info
  const { error: bankInfoError } = await db
    .from("vendor_bank_info")
    .insert([{ ...bankInfo, vendor_id }])
  if (bankInfoError) throw bankInfoError

  // Insert contacts
  const { error: contactError } = await db
    .from("vendor_contacts")
    .insert([{ ...contacts, vendor_id }])
  if (contactError) throw contactError

  // Insert documents
  const { error: docError } = await db
    .from("vendor_documents")
    .insert([{ ...documents, vendor_id }])
  if (docError) throw docError

  // Insert fleet
  const { error: fleetError } = await db
    .from("vendor_fleets")
    .insert(fleet.map((f) => ({ ...f, vendor_id })))
  if (fleetError) throw fleetError

  await db.from("audit_logs").insert([
    {
      entity_type: "vendor",
      reference_id: vendor_id,
      action: "created",
      performed_by: createdBy,
      remarks: `Vendor '${vendor.name}' (${vendor.city}) onboarded by employee ${createdBy}`,
    },
  ])

  const createdByUser = await db
    .from("employees")
    .select("id, first_name, last_name, email, phone")
    .eq("id", createdBy)
    .single()

  await axios.post(
    `https://www.zohoapis.in/crm/v7/functions/vendor_data/actions/execute?auth_type=apikey&zapikey=1003.a0c79906670c4b5b04784b5a644999f1.5c5be3a14e8532fc6dd03c5f9f07bf79`,
    {
      id: vendor_id,
      vendor_id: vendorId, // VNDDL0004
      ...input,
      agent: createdByUser,
    }
  )

  return { vendor_id }
}

export const getVendorById = async (id: string) => {
  const { data, error } = await db
    .from("vendors")
    .select(
      `*,
       documents:vendor_documents(*),
    contacts:vendor_contacts(*),
    operating_areas:vendor_operating_areas(*),
    services:vendor_services(*),
    bank_info:vendor_bank_info(*),
    fleet:vendor_fleets(*)`
    )
    .eq("vendor_id", id)
    .single()

  if (error) {
    return {
      success: false,
      status: 404,
      message: "Vendor not found" + error.message,
    }
  }

  return {
    vendor: {
      id: data.id,
      name: data.name,
      address: data.address,
      city: data.city,
      state: data.state,
      pincode: data.pincode,
      primary_contact_name: data.primary_contact_name,
      primary_contact_number: data.primary_contact_number,
      primary_email: data.primary_email,
      status: data.status,
      location_url: data.location_url,
      vendor_id: data.vendor_id,
      login_enabled: data.login_enabled,
      created_at: data.created_at,
      updated_at: data.updated_at,
      created_by: data.created_by,
      price_list_file: data.price_list_file_path,
      remark: data.remark,
      repair_on_site: data.repair_on_site,
      due_date: data.due_date,
      is_active: data.is_active,
      remark_title: data.remark_title,
    },
    documents: {
      gst_number: data.documents[0]?.gst_number,
      pan_number: data.documents[0]?.pan_number,
      pan_card: data.documents[0]?.pan_card_file_path,
      address_proof: data.documents[0]?.address_proof_file_path,
      gst_certificate: data.documents[0]?.gst_certificate_file_path,
      cancelled_cheque: data.documents[0]?.cancelled_cheque_file_path,
    },
    contacts: {
      finance: {
        name: data.contacts[0]?.finance_contact_name,
        email: data.contacts[0]?.finance_contact_email,
        number: data.contacts[0]?.finance_contact_number,
      },
    },
    coverage: {
      operating_areas: data.operating_areas.map((area) => ({
        city: area.city,
        region: area.region,
        location: area.location,
        coordinates: {
          latitude: area.latitude,
          longitude: area.longitude,
        },
        vehicles: area.vehicles,
      })),
    },
    operations: {
      availability: {
        is_24x7: data.is_24x7,
        time_start: data.time_start,
        time_end: data.time_end,
        available_days: data.available_days,
      },
    },
    services: data.services.map((service) => ({
      service_name: service.service_name,
      night_charge: service.night_charge,
      day_charge: service.day_charge,
      fixed_distance_charge: service.fixed_distance_charge,
      additional_price: service.additional_price,
      waiting_charge: service.waiting_charge,
    })),
    bank_info: {
      bank_name: data.bank_info[0]?.bank_name,
      account_number: data.bank_info[0]?.account_number,
      account_holder_name: data.bank_info[0]?.account_holder_name,
      ifsc_code: data.bank_info[0]?.ifsc_code,
      cancelled_cheque: data.bank_info[0]?.cancelled_cheque_file_path,
    },
    fleet: data.fleet,
  }
}

export const getAllVendors = async (employeeID: string) => {
  const { data, error } = await db
    .from("vendors")
    .select(
      `
      id,
      name, 
      address,
      city,
      state,
      pincode,
      primary_contact_name,
      primary_contact_number,
      primary_email,
      status,
      location_url,
      vendor_id,
      created_at
    `
    )
    .eq("created_by", employeeID)
    .order("created_at", { ascending: false })

  if (error) throw error
  return data
}

export const getVendorsByLocation = async (lat: number, lng: number, radius_km: number) => {
  console.log(lat, lng, radius_km)

  const radiusKm = Number(radius_km) || 10
  const radiusM = radiusKm * 1000

  const { data, error } = await db.rpc("find_nearby_vendors", {
    lat: lat,
    lng: lng,
    radius_m: radiusM,
  })

  if (error) throw error

  return data.map((vendor) => ({
    ...vendor,
    distance_km: (vendor.distance_meters / 1000).toFixed(2),
  }))
}

export const employeeVendorCountStat = async (employeeId: string) => {
  // 1. Get total vendors count
  const { count: totalVendorsCount, error: totalVendorsError } = await db
    .from("vendors")
    .select("*", { count: "exact", head: true })
  if (totalVendorsError) throw totalVendorsError

  // 2. Get pending vendors created by the employee
  const { count: pendingVendorsCount, error: pendingVendorsError } = await db
    .from("vendors")
    .select("*", { count: "exact", head: true })
    .eq("created_by", employeeId)
    .eq("status", "pending")
  if (pendingVendorsError) throw pendingVendorsError

  // 3. Get all vendors created by the employee
  const { count: vendorCount, error: vendorsError } = await db
    .from("vendors")
    .select("*", { count: "exact", head: true })
    .eq("created_by", employeeId)
  if (vendorsError) throw vendorsError

  return {
    total_vendors: totalVendorsCount ?? 0,
    pending_vendors: pendingVendorsCount ?? 0,
    onboarded_vendors: vendorCount ?? 0,
  }
}
