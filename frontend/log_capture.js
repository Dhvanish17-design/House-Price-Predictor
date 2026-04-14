import puppeteer from 'puppeteer';

(async () => {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    page.on('console', msg => console.log('BROWSERLOG:', msg.text()));
    page.on('pageerror', err => console.log('PAGEERROR:', err.toString()));
    
    await page.goto('http://localhost:5173', { waitUntil: 'networkidle0', timeout: 10000 });
    await browser.close();
  } catch (error) {
    console.error("Puppeteer Script Error:", error);
    process.exit(1);
  }
})();
