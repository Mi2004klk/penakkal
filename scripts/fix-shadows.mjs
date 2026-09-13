import fs from 'fs';
import { globSync } from 'glob';

const files = globSync('src/**/*.{tsx,ts}');

let replacedCount = 0;

for (const file of files) {
  let content = fs.readFileSync(file, 'utf-8');
  let changed = false;

  const shadowMappings = {
    'shadow-sm': 'shadow-card',
    'shadow-md': 'shadow-dropdown',
    'shadow-lg': 'shadow-modal',
    'shadow-xl': 'shadow-modal',
  };

  for (const [oldClass, newClass] of Object.entries(shadowMappings)) {
    const regex = new RegExp(`\\b${oldClass}\\b`, 'g');
    if (regex.test(content)) {
      content = content.replace(regex, newClass);
      changed = true;
    }
  }

  if (changed) {
    fs.writeFileSync(file, content);
    replacedCount++;
  }
}

console.log(`Replaced shadows in ${replacedCount} files.`);
