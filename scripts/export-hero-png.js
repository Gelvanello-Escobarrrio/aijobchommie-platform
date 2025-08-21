const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

(async () => {
  const out = path.resolve(__dirname, '../apps/web/public/assets/hero-4k.png');
  const svgPath = path.resolve(__dirname, '../apps/web/public/assets/hero-4k.svg');
  if (!fs.existsSync(svgPath)) {
    console.error('SVG not found at', svgPath);
    process.exit(1);
  }

  const html = `<!doctype html><html><body style="margin:0;background:transparent"><img id="hero" src="file://${svgPath}" width="3840" height="2160"></body></html>`;
  const browser = await puppeteer.launch({args: ['--no-sandbox','--disable-setuid-sandbox']});
  const page = await browser.newPage();
  await page.setViewport({width: 3840, height: 2160, deviceScaleFactor: 1});
  await page.setContent(html, {waitUntil: 'networkidle0'});
  const el = await page.$('#hero');
  await el.screenshot({path: out});
  await browser.close();
  console.log('Wrote', out);
})();
