import fs from 'fs';
import path from 'path';

let hasError = false;

// Check if globals.css contains the forbidden --spacing-N declarations
const globalsContent = fs.readFileSync('src/app/globals.css', 'utf-8');
const forbiddenMatch = globalsContent.match(/--spacing-(8|16|24|32|40|48|64|104)\s*:/);

if (forbiddenMatch) {
  console.error(`\n❌ ERROR: Tailwind spacing override found in globals.css: ${forbiddenMatch[0]}`);
  console.error('Do not override Tailwind spacing scale in @theme as it breaks utility monotonic scale.');
  hasError = true;
}

if (hasError) {
  process.exit(1);
} else {
  console.log('✅ Spacing scale integrity check passed.');
}
