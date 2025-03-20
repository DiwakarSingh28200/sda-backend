// Personal Information
export interface PersonalInfo {
    first_name: string;
    last_name: string;
    dob: string;
    gender: "male" | "female" | "other";
    email: string;
    phone: string;
    address: string;
  }
  
  // Employee Documents
  export interface Documents {
    aadhar_id: string;
    pancard: string;
  }
  
  // Bank Details
  export interface BankDetails {
    bank_account: string;
    ifsc_code: string;
  }
  
  // Emergency Contact
  export interface EmergencyContact {
    name: string;
    phone: string;
    relation: string;
  }
  
  // Employment Details
  export interface EmploymentDetails {
    role_id: string;
    department_id: string;
    employment_type: any;
    salary: number;
    tax_deductions?: number;
    provident_fund?: number;
    reporting_manager: string;
  }
  
  // Main Employee Creation Request Body
  export interface CreateEmployeeRequest {
    personal_info: PersonalInfo;
    documents: Documents;
    bank_details: BankDetails;
    emergency_contact: EmergencyContact;
    employment_details: EmploymentDetails;
    created_by: any;
  }
  