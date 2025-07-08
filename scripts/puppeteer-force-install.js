// scripts/puppeteer-force-install.js
const { join } = require("path")
const { existsSync } = require("fs")
const puppeteer = require("puppeteer")

;(async () => {
  const executable = puppeteer.executablePath()
  if (!existsSync(executable)) {
    console.log("Chromium not found. Downloading...")
    const { install } = require("puppeteer/lib/cjs/puppeteer/node/install.js")
    await install()
    console.log("✅ Chromium installed")
  } else {
    console.log("✅ Chromium already exists at:", executable)
  }
})()
