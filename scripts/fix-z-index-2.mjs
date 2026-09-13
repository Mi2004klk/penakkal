import fs from 'fs';
import { globSync } from 'glob';

const files = globSync('src/**/*.{tsx,ts}');
let count = 0;

for (const file of files) {
  let content = fs.readFileSync(file, 'utf-8');
  let original = content;

  // ScrollToTop -> z-nav
  if (file.includes('ScrollToTop.tsx')) {
    content = content.replace(/\bz-40\b/g, 'z-nav');
  }

  // FontSizeControl dropdown -> z-dropdown
  if (file.includes('FontSizeControl.tsx')) {
    content = content.replace(/\bz-50\b/g, 'z-dropdown');
  }

  // FilterPanel
  if (file.includes('FilterPanel.tsx')) {
    content = content.replace(/\bz-40\b/g, 'z-drawer'); // overlay
    content = content.replace(/\bz-50\b/g, 'z-drawer'); // panel
  }

  // TableOfContents
  if (file.includes('TableOfContents.tsx')) {
    content = content.replace(/\bz-40\b/g, 'z-nav'); // toggle button
    content = content.replace(/\bz-50\b/g, 'z-modal'); // mobile modal
  }

  // Toast in saved/page.tsx
  if (file.includes('saved/page.tsx')) {
    content = content.replace(/\bz-50\b/g, 'z-toast');
  }

  // Replace any straggler z-40 and z-50
  // e.g. MobileNav.tsx z-40 -> z-nav
  if (file.includes('MobileNav.tsx')) {
    content = content.replace(/\bz-40\b/g, 'z-nav');
  }

  if (content !== original) {
    fs.writeFileSync(file, content);
    console.log(`Updated ${file}`);
    count++;
  }
}
console.log(`Done updating ${count} files.`);
