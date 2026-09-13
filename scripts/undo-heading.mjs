import fs from 'fs';
import { globSync } from 'glob';

const files = globSync('src/**/*.{tsx,ts}');

let reverted = 0;

for (const file of files) {
  let content = fs.readFileSync(file, 'utf-8');
  if (content.includes('text-heading-md text-heading')) {
    content = content.replace(/text-heading-md text-heading/g, 'text-heading');
    fs.writeFileSync(file, content);
    reverted++;
    console.log(`Reverted in ${file}`);
  }
}

console.log(`Reverted ${reverted} files.`);
