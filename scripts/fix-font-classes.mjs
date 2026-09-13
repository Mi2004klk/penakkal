import fs from 'fs';
import { globSync } from 'glob';

const files = globSync('src/**/*.{tsx,ts}');

let replaced = 0;

for (const file of files) {
  let content = fs.readFileSync(file, 'utf-8');
  let changed = false;

  const fontMappings = {
    'font-[family-name:var(--font-display)]': 'font-display',
    'font-[family-name:var(--font-body)]': 'font-body',
    'font-[family-name:var(--font-ui)]': 'font-ui',
    'font-[family-name:var(--font-arabic)]': 'font-arabic',
    'font-[family-name:var(--font-quran)]': 'font-quran',
    'font-[family-name:var(--font-tamil)]': 'font-tamil',
    'font-[family-name:var(--font-condensed)]': 'font-ui', // Fallback to ui as plan said
  };

  for (const [oldClass, newClass] of Object.entries(fontMappings)) {
    if (content.includes(oldClass)) {
      // Escape the regex
      const regex = new RegExp(oldClass.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g');
      content = content.replace(regex, newClass);
      changed = true;
    }
  }

  if (changed) {
    fs.writeFileSync(file, content);
    replaced++;
  }
}

console.log(`Replaced font arbitrary classes in ${replaced} files.`);
