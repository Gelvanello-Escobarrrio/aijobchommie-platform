Exporting hero-4k.png

This repository includes a Node script that renders the 4K SVG hero into a 3840×2160 PNG using Puppeteer.

When running in CI (GitHub Actions on ubuntu-latest) Chrome is available and the workflow will produce the PNG and upload it as an artifact.

Running locally
- If your environment cannot run Puppeteer's bundled Chromium (missing native libs), point the script at your local Chrome/Chromium executable using CHROME_PATH.

Examples:

Linux/macOS (bash):

```bash
export CHROME_PATH="/usr/bin/google-chrome"
cd apps/web
npm run export-hero-png
```

macOS (bash/zsh):

```bash
export CHROME_PATH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
cd apps/web
npm run export-hero-png
```

Windows (PowerShell):

```powershell
$env:CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
cd apps/web
npm run export-hero-png
```

If you prefer CI to produce the asset, the `Build Storybook and Upload Static` workflow will also create and upload `hero-4k.png` as an artifact when run manually or on push to `main`.
