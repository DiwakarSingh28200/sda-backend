import { db } from "../../../config/db"

export const getAllPendingVendorsService = async () => {
  const { data, error } = await db
    .from("vendors")
    .select(
      `
      *,
      documents:vendor_documents(*),
      contacts:vendor_contacts(*),
      operating_areas:vendor_operating_areas(*),
      services:vendor_services(*),
      bank_info:vendor_bank_info(*)
    `
    )
    .eq("status", "pending")

  if (error) {
    return {
      success: false,
      message: error.message,
    }
  }

  const vendors = data.map((vendor) => {
    return {
      vendor: {
        id: vendor.id,
        name: vendor.name,
        address: vendor.address,
        city: vendor.city,
        state: vendor.state,
        pincode: vendor.pincode,
        primary_contact_name: vendor.primary_contact_name,
        primary_contact_number: vendor.primary_contact_number,
        primary_email: vendor.primary_email,
        status: vendor.status,
        location_url: vendor.location_url,
        vendor_id: vendor.vendor_id,
        login_enabled: vendor.login_enabled,
        created_at: vendor.created_at,
        updated_at: vendor.updated_at,
        created_by: vendor.created_by,
        price_list_file: vendor.price_list_file_path,
        remark: vendor.remark,
        repair_on_site: vendor.repair_on_site,
        due_date: vendor.due_date,
        is_active: vendor.is_active,
        remark_title: vendor.remark_title,
      },
      documents: vendor.documents?.[0]
        ? {
            gst_number: vendor.documents[0]?.gst_number,
            pan_number: vendor.documents[0]?.pan_number,
            pan_card: vendor.documents[0]?.pan_card_file_path,
            address_proof: vendor.documents[0]?.address_proof_file_path,
            gst_certificate: vendor.documents[0]?.gst_certificate_file_path,
            cancelled_cheque: vendor.documents[0]?.cancelled_cheque_file_path,
          }
        : null,
      contacts: vendor.contacts?.[0]
        ? {
            finance: {
              name: vendor.contacts[0]?.finance_contact_name,
              email: vendor.contacts[0]?.finance_contact_email,
              number: vendor.contacts[0]?.finance_contact_number,
            },
          }
        : null,
      coverage: {
        operating_areas:
          vendor.operating_areas?.map((area) => ({
            city: area.city,
            region: area.region,
            location: area.location,
            coordinates: {
              latitude: area.latitude,
              longitude: area.longitude,
            },
          })) ?? [],
      },
      operations: {
        availability: {
          is_24x7: vendor.is_24x7,
          time_start: vendor.time_start,
          time_end: vendor.time_end,
          available_days: vendor.available_days,
        },
      },
      services:
        vendor.services?.map((service) => ({
          service_name: service.service_name,
          night_charge: service.night_charge,
          day_charge: service.day_charge,
          fixed_distance_charge: service.fixed_distance_charge,
          additional_price: service.additional_price,
        })) ?? [],
      bank_info: vendor.bank_info?.[0]
        ? {
            bank_name: vendor.bank_info[0]?.bank_name,
            account_number: vendor.bank_info[0]?.account_number,
            account_holder_name: vendor.bank_info[0]?.account_holder_name,
            ifsc_code: vendor.bank_info[0]?.ifsc_code,
            cancelled_cheque: vendor.bank_info[0]?.cancelled_cheque_file_path,
          }
        : null,
    }
  })

  return {
    success: true,
    data: vendors,
  }
}

export const approveVendorService = async (vendorId: string) => {
  const { data: vendor, error } = await db
    .from("vendors")
    .update({ status: "approved", login_enabled: true, is_active: true })
    .eq("id", vendorId)
    .select()
    .single()

  if (error) {
    return {
      success: false,
      message: error.message,
    }
  }

  return {
    success: true,
    message: "Vendor approved successfully",
    data: vendor,
  }
}

export const rejectVendorService = async (vendorId: string) => {
  const { data: vendor, error } = await db
    .from("vendors")
    .update({ status: "rejected" })
    .eq("id", vendorId)
    .select()
    .single()

  if (error) {
    return {
      success: false,
      message: error.message,
    }
  }

  return {
    success: true,
    message: "Vendor rejected successfully",
    data: vendor,
  }
}
