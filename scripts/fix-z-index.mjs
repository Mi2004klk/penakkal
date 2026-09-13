import fs from 'fs';
import { globSync } from 'glob';

const files = globSync('src/**/*.{tsx,ts}');
let count = 0;

for (const file of files) {
  let content = fs.readFileSync(file, 'utf-8');
  let original = content;

  // ReadingProgress
  if (file.includes('ReadingProgress')) {
    content = content.replace(/z-\[49\]/g, 'z-progress');
  }

  // TOC, FilterPanel (Dropdowns / sticky menus)
  if (file.includes('TableOfContents') || file.includes('FilterPanel')) {
    content = content.replace(/z-\[50\]/g, 'z-dropdown');
    content = content.replace(/\bz-50\b/g, 'z-dropdown');
  }

  // Drawers / MobileNav / Header
  if (file.includes('MobileNav') || file.includes('Header') || file.includes('Sidebar')) {
    content = content.replace(/\bz-50\b/g, 'z-nav');
    content = content.replace(/\bz-40\b/g, 'z-nav');
    content = content.replace(/z-\[50\]/g, 'z-nav');
    content = content.replace(/z-\[90\]/g, 'z-drawer');
    content = content.replace(/z-\[100\]/g, 'z-drawer');
  }

  // SearchModal / ViewToggle / Modals
  if (file.includes('SearchModal') || file.includes('ViewToggle')) {
    content = content.replace(/\bz-50\b/g, 'z-modal');
    content = content.replace(/z-\[100\]/g, 'z-modal');
  }

  // Other components (general replacements for raw z-index where context is less clear)
  // We'll replace z-[60] with z-dropdown generally
  content = content.replace(/z-\[60\]/g, 'z-dropdown');
  
  // z-50 in toasts or generally
  if (file.includes('Toast') || file.includes('Alert')) {
    content = content.replace(/\bz-50\b/g, 'z-toast');
  }

  if (content !== original) {
    fs.writeFileSync(file, content);
    console.log(`Updated ${file}`);
    count++;
  }
}
console.log(`Done updating ${count} files.`);
