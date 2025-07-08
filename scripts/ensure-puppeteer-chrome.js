const fs = require("fs")
const puppeteer = require("puppeteer")

;(async () => {
  try {
    const chromePath = puppeteer.executablePath()
    if (!fs.existsSync(chromePath)) {
      console.log("Chromium not found. Forcing Puppeteer download...")
      const install = require("puppeteer/lib/cjs/puppeteer/node/install.js").install
      await install()
    } else {
      console.log("Chromium already installed at:", chromePath)
    }
  } catch (err) {
    console.error("Failed to install Puppeteer Chromium:", err)
    process.exit(1)
  }
})()
