import * as pdfMake from "pdfmake/build/pdfmake"
import * as pdfFonts from "pdfmake/build/vfs_fonts"
;(pdfMake as any).vfs = pdfFonts.vfs

export default pdfMake
