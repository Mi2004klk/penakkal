import fs from 'fs';
import { globSync } from 'glob';

const files = globSync('src/**/*.{tsx,ts}');
let count = 0;

for (const file of files) {
  let content = fs.readFileSync(file, 'utf-8');
  let original = content;

  // text-red-500 -> text-error
  content = content.replace(/\btext-red-500\b/g, 'text-error');

  // text-white -> text-pure-white
  content = content.replace(/\btext-white\b/g, 'text-pure-white');

  // bg-white/20 -> bg-pure-white/20
  content = content.replace(/\bbg-white\/20\b/g, 'bg-pure-white/20');
  
  // bg-white -> bg-pure-white
  content = content.replace(/(?<!-)bg-white(?!\/)/g, 'bg-pure-white');

  if (content !== original) {
    fs.writeFileSync(file, content);
    console.log(`Updated ${file}`);
    count++;
  }
}
console.log(`Done updating ${count} files.`);
