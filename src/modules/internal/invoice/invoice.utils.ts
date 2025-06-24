import puppeteer from "puppeteer"
import path from "path"
import fs from "fs/promises"

type InvoiceData = Record<string, string | number>

export async function generateInvoicePdf(data: InvoiceData): Promise<Uint8Array> {
  const templatePath = path.join(__dirname, "./invoice.templates.html")
  let html = await fs.readFile(templatePath, "utf-8")

  // Replace placeholders like {{invoiceNumber}} with actual data
  for (const [key, value] of Object.entries(data)) {
    const regex = new RegExp(`{{\\s*${key}\\s*}}`, "g")
    html = html.replace(regex, String(value))
  }

  // Launch headless browser
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  })
  const page = await browser.newPage()

  // Set HTML content
  await page.setContent(html, { waitUntil: "networkidle0" })

  // Generate PDF buffer
  const pdfBuffer = await page.pdf({
    format: "A4",
    printBackground: true,
    margin: { top: "20px", right: "20px", bottom: "40px", left: "20px" },
  })

  await browser.close()
  return pdfBuffer
}
