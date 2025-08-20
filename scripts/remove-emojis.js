#!/usr/bin/env node
// scans repo files and removes emoji characters from text files
const fs = require('fs');
const path = require('path');

const repoRoot = path.resolve(__dirname, '..');
const whitelistExt = new Set([
  '.js', '.jsx', '.ts', '.tsx', '.json', '.md', '.html', '.htm', '.css', '.scss', '.yml', '.yaml', '.sh', '.ps1', '.sql', '.txt', '.jsx', '.tsx'
]);

// Matches most emoji characters (uses Unicode Extended Pictographic property)
const emojiRegex = /[\p{Extended_Pictographic}\uFE0F]/gu;

function isBinary(filename) {
  const binExt = ['.png', '.jpg', '.jpeg', '.gif', '.ico', '.lock', '.zip', '.gz', '.tgz', '.bmp', '.pdf'];
  return binExt.includes(path.extname(filename).toLowerCase());
}

let filesScanned = 0;
let filesChanged = 0;
let totalReplacements = 0;

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (['.git', 'node_modules', 'dist', 'build'].includes(entry.name)) continue;
      walk(full);
    } else if (entry.isFile()) {
      filesScanned++;
      if (isBinary(full)) continue;
      const ext = path.extname(full).toLowerCase();
      if (!whitelistExt.has(ext)) continue;
      try {
        const raw = fs.readFileSync(full, 'utf8');
        if (emojiRegex.test(raw)) {
          const cleaned = raw.replace(emojiRegex, '');
          fs.writeFileSync(full, cleaned, 'utf8');
          filesChanged++;
          const count = (raw.match(emojiRegex) || []).length;
          totalReplacements += count;
          console.log(`Updated ${full} — removed ${count} emoji(s)`);
        }
      } catch (err) {
        // ignore read errors
      }
    }
  }
}

console.log('Starting emoji removal...');
walk(repoRoot);
console.log('\nSummary:');
console.log(`Files scanned: ${filesScanned}`);
console.log(`Files changed: ${filesChanged}`);
console.log(`Total emoji removed: ${totalReplacements}`);

if (filesChanged > 0) process.exitCode = 0; else process.exitCode = 0;
