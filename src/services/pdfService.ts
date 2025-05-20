import pdfMake from "../utils/pdfFonts"
import { printer } from "../utils/pdfPrinter"
import { TDocumentDefinitions } from "pdfmake/interfaces"

export const generatePolicyPdf = async (data: Record<string, string>): Promise<Buffer> => {
  const docDefinition: TDocumentDefinitions = {
    content: [
      { text: "SureDrive RSA Policy Certificate", style: "header" },
      "\n",
      { text: `Policy No: ${data.policy_number}` },
      { text: `Plan: ${data.plan_name} (${data.plan_duration} year)` },
      { text: `Start Date: ${data.start_date}` },
      { text: `End Date: ${data.end_date}` },
      "\n",
      { text: `Customer: ${data.customer_name}` },
      { text: `Phone: ${data.phone}` },
      { text: `Address: ${data.address}` },
      "\n",
      { text: `Vehicle: ${data.vehicle_model} - ${data.vehicle_number}` },
      { text: `Chassis No: ${data.chassis_number}` },
      { text: `Engine No: ${data.engine_number}` },
    ],
    styles: {
      header: {
        fontSize: 18,
        bold: true,
        alignment: "center" as const,
        margin: [0, 0, 0, 20],
      },
    },
  }

  const pdfDoc = printer.createPdfKitDocument(docDefinition)

  const chunks: Uint8Array[] = []
  return new Promise((resolve, reject) => {
    pdfDoc.on("data", (chunk) => chunks.push(chunk))
    pdfDoc.on("end", () => resolve(Buffer.concat(chunks)))
    pdfDoc.on("error", reject)
    pdfDoc.end()
  })
}
