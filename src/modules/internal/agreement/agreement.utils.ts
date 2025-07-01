// services/generateAgreementPdf.ts
import fs from "fs"
import path from "path"
import puppeteer from "puppeteer"

export function renderTemplate(template: string, data: Record<string, string>) {
  return template.replace(/\{\{(.*?)\}\}/g, (_, key) => data[key.trim()] || "")
}

export const generateAgreementPDF = async (data: Record<string, string>): Promise<Uint8Array> => {
  const templatePath = path.join(__dirname, "./dealer-agreement.template.html")
  const rawHtml = fs.readFileSync(templatePath, "utf-8")
  const compiledHtml = renderTemplate(rawHtml, data)

  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  })
  const page = await browser.newPage()
  await page.setContent(compiledHtml, { waitUntil: "networkidle0" })

  const pdfBuffer = await page.pdf({
    format: "A4",
    printBackground: true,
    margin: { top: "20px", right: "10px", bottom: "40px", left: "10px" },
  })
  await browser.close()

  return pdfBuffer
}
