import PdfPrinter from "pdfmake"
import path from "path"
import fs from "fs"

const fonts = {
  Roboto: {
    normal: path.join(__dirname, "../../public/fonts/Roboto-Regular.ttf"),
    bold: path.join(__dirname, "../../public/fonts/Roboto-Bold.ttf"),
    italics: path.join(__dirname, "../../public/fonts/Roboto-Italic.ttf"),
    bolditalics: path.join(__dirname, "../../public/fonts/Roboto-BoldItalic.ttf"),
  },
}

export const printer = new PdfPrinter(fonts)
