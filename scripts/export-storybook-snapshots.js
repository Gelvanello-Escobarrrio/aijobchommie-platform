const path = require('path');
const fs = require('fs');
const puppeteer = require('puppeteer');
const execa = require('child_process').execSync;

(async () => {
  const storybookOut = path.resolve(__dirname, '../apps/web/storybook-static');
  console.log('Building storybook...');
  execa('cd apps/web && npm run build-storybook', { stdio: 'inherit' });

  const url = 'file://' + path.join(storybookOut, 'index.html');
  console.log('Opening', url);
  const browser = await puppeteer.launch({ args: ['--no-sandbox','--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'networkidle0' });

  // Wait for storybook sidebar to load and then navigate to our story via URL hash
  const storyUrl = url + '#/landing/hero--default';
  await page.goto(storyUrl, { waitUntil: 'networkidle0' });
  await page.setViewport({ width: 3840, height: 2160 });
  await page.screenshot({ path: path.join(storybookOut, 'landing-hero-default.png'), fullPage: true });
  console.log('Wrote snapshot to', path.join(storybookOut, 'landing-hero-default.png'));
  await browser.close();
})();
