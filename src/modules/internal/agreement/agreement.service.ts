import { generateAgreementPDF } from "./agreement.utils"

export const generateDealerAgreement = async (dealerId: string) => {
  const dealerAgreementData = {
    // Date
    DAY: "29",
    MONTH: "June",

    // SDA Signatory
    SDA_SALES_HEAD_NAME: "Anjali Sharma",
    SDA_SALES_HEAD_DESIGNATION: "Regional Sales Head",

    SDA_SIGNATORY_NAME: "Anjali Sharma",
    SDA_SIGNATORY_DESIGNATION: "Regional Sales Head",
    SDA_SIGNATURE_DATE: "29-06-2025",
    SDA_SIGNATURE_PLACE: "Gurugram",

    SDA_SIGNATORY_NAME_ANNEX1: "Anjali Sharma",
    SDA_SIGNATORY_DESIGNATION_ANNEX1: "Regional Sales Head",
    SDA_SIGNATURE_DATE_ANNEX1: "29-06-2025",
    SDA_SIGNATURE_PLACE_ANNEX1: "Gurugram",

    SDA_SIGNATORY_NAME_ANNEX2: "Anjali Sharma",
    SDA_SIGNATORY_DESIGNATION_ANNEX2: "Regional Sales Head",
    SDA_SIGNATURE_DATE_ANNEX2: "29-06-2025",
    SDA_SIGNATURE_PLACE_ANNEX2: "Gurugram",

    SDA_SIGNATORY_NAME_ANNEX3: "Anjali Sharma",
    SDA_SIGNATORY_DESIGNATION_ANNEX3: "Regional Sales Head",
    SDA_SIGNATURE_DATE_ANNEX3: "29-06-2025",
    SDA_SIGNATURE_PLACE_ANNEX3: "Gurugram",

    // Dealer Info
    DEALER_FULL_LEGAL_NAME: "XYZ Automobiles Pvt. Ltd.",
    DEALER_ENTITY_TYPE: "Private Limited",
    DEALER_ADDRESS: "123 MG Road, Mumbai, Maharashtra",
    DEALER_REGISTRATION_ID_IF_APPLICABLE: "REG-987654321",

    // Dealer Signatory
    DEALER_AUTHORIZED_SIGNATORY_NAME: "Rajesh Mehta",
    DEALER_AUTHORIZED_SIGNATORY_DESIGNATION: "Managing Director",

    DEALER_NAME_FOR_SIGNATURE: "XYZ Automobiles Pvt. Ltd.",
    DEALER_SIGNATORY_NAME: "Rajesh Mehta",
    DEALER_SIGNATORY_DESIGNATION: "Managing Director",
    DEALER_SIGNATURE_DATE: "29-06-2025",
    DEALER_SIGNATURE_PLACE: "Mumbai",

    DEALER_NAME_FOR_SIGNATURE_ANNEX1: "XYZ Automobiles Pvt. Ltd.",
    DEALER_SIGNATORY_NAME_ANNEX1: "Rajesh Mehta",
    DEALER_SIGNATORY_DESIGNATION_ANNEX1: "Managing Director",
    DEALER_SIGNATURE_DATE_ANNEX1: "29-06-2025",
    DEALER_SIGNATURE_PLACE_ANNEX1: "Mumbai",

    DEALER_NAME_FOR_SIGNATURE_ANNEX2: "XYZ Automobiles Pvt. Ltd.",
    DEALER_SIGNATORY_NAME_ANNEX2: "Rajesh Mehta",
    DEALER_SIGNATORY_DESIGNATION_ANNEX2: "Managing Director",
    DEALER_SIGNATURE_DATE_ANNEX2: "29-06-2025",
    DEALER_SIGNATURE_PLACE_ANNEX2: "Mumbai",

    DEALER_NAME_FOR_SIGNATURE_ANNEX3: "XYZ Automobiles Pvt. Ltd.",
    DEALER_SIGNATORY_NAME_ANNEX3: "Rajesh Mehta",
    DEALER_SIGNATORY_DESIGNATION_ANNEX3: "Managing Director",
    DEALER_SIGNATURE_DATE_ANNEX3: "29-06-2025",
    DEALER_SIGNATURE_PLACE_ANNEX3: "Mumbai",

    // Dealer Notice Contact
    DEALER_NAME_FOR_NOTICES: "XYZ Automobiles Pvt. Ltd.",
    DEALER_ADDRESS_FOR_NOTICES: "123 MG Road, Mumbai, Maharashtra",
    DEALER_EMAIL_FOR_NOTICES: "contact@xyzauto.com",
    DEALER_REPRESENTATIVE_NAME_DESIGNATION_FOR_NOTICES: "Rajesh Mehta, Managing Director",

    // Security Cheque
    CHEQUE_NO: "008764",
    CHEQUE_DATE: "25-06-2025",
    CHEQUE_AMOUNT: "1,00,000",

    // Commission Structure - Core
    SURE_SHIELD_CORE_COMMISSION_1_YR: "50",
    SURE_SHIELD_CORE_COMMISSION_2_YR: "90",
    SURE_SHIELD_CORE_COMMISSION_3_YR: "120",
    SURE_SHIELD_CORE_COMMISSION_4_YR: "140",

    // Commission Structure - Max
    SURE_SHIELD_MAX_COMMISSION_1_YR: "150",
    SURE_SHIELD_MAX_COMMISSION_2_YR: "230",
    SURE_SHIELD_MAX_COMMISSION_3_YR: "320",
    SURE_SHIELD_MAX_COMMISSION_4_YR: "360",
  }

  const pdfBuffer = await generateAgreementPDF(dealerAgreementData)
  return pdfBuffer
}
