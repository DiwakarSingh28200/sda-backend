import fs from "fs"
import path from "path"
import { chromium } from "playwright"

export function renderTemplate(template: string, data: Record<string, string>) {
  return template.replace(/\{\{(.*?)\}\}/g, (_, key) => data[key.trim()] || "")
}

export const generateAgreementPDF = async (data: Record<string, string>): Promise<Uint8Array> => {
  // const templatePath = path.join(__dirname, "./dealer-agreement.template.html")
  const templatePath = path.join(
    process.cwd(),
    "src",
    "template",
    "dealer-agreement.template.html"
  )

  const rawHtml = fs.readFileSync(templatePath, "utf-8")
  const compiledHtml = renderTemplate(rawHtml, data)

  const browser = await chromium.launch({
    headless: true,
  })

  const page = await browser.newPage()
  await page.setContent(compiledHtml, { waitUntil: "domcontentloaded" })

  const pdfBuffer = await page.pdf({
    format: "A4",
    printBackground: true,
    margin: {
      top: "20px",
      right: "10px",
      bottom: "40px",
      left: "10px",
    },
  })

  await browser.close()

  return pdfBuffer
}

export const generateVendorAgreementPDF = async (
  data: Record<string, string>
): Promise<Uint8Array> => {
  const templatePath = path.join(
    process.cwd(),
    "src",
    "template",
    "vendor-agreement.template.html"
  )

  const rawHtml = fs.readFileSync(templatePath, "utf-8")
  const compiledHtml = renderTemplate(rawHtml, data)

  const browser = await chromium.launch({
    headless: true,
  })

  const page = await browser.newPage()
  await page.setContent(compiledHtml, { waitUntil: "domcontentloaded" })

  const pdfBuffer = await page.pdf({
    format: "A4",
    printBackground: true,
    margin: {
      top: "20px",
      right: "10px",
      bottom: "40px",
      left: "10px",
    },
  })

  await browser.close()

  return pdfBuffer
}
