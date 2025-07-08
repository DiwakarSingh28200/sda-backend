const { execSync } = require("child_process")

try {
  console.log("⏳ Forcing Puppeteer to install Chrome...")
  execSync("npx puppeteer browsers install chrome", { stdio: "inherit" })
  console.log("✅ Puppeteer Chromium installed successfully.")
} catch (err) {
  console.error("❌ Failed to install Puppeteer Chromium:", err)
  process.exit(1)
}
