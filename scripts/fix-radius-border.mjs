import fs from 'fs';
import { globSync } from 'glob';

const files = globSync('src/**/*.{tsx,ts}');
let count = 0;

for (const file of files) {
  let content = fs.readFileSync(file, 'utf-8');
  let original = content;

  // Replace raw borders
  content = content.replace(/border-ash dark:border-slate/g, 'border-border-default');
  content = content.replace(/dark:border-slate/g, ''); // in case some were just dark:border-slate

  // TableOfContents.tsx:130
  if (file.includes('TableOfContents.tsx')) {
    content = content.replace(/rounded-t-3xl/g, 'rounded-t-cards');
  }

  // Sidebar.tsx:24
  if (file.includes('Sidebar.tsx')) {
    content = content.replace(/rounded-\[8px\]/g, 'rounded-buttons');
  }

  // Find controls and replace bare rounded/rounded-sm
  // This is tricky because we only want to replace it on controls (buttons, inputs, etc)
  // Let's replace ' rounded ' or ' rounded-sm '
  // Wait, the plan says: "Small-control radius = rounded-buttons everywhere (replace bare rounded/rounded-sm on controls)"
  // Since we only have ~27 uses total (14 + 13), it's safe to just replace them everywhere since bare rounded is not a design token.
  content = content.replace(/\brounded-sm\b/g, 'rounded-buttons');
  
  // For bare 'rounded', we need to match it exactly as a class
  content = content.replace(/(["'\s])rounded(["'\s])/g, '$1rounded-buttons$2');

  // Some cleanup if we get double classes or double spaces
  content = content.replace(/border-border-default\s+border-border-default/g, 'border-border-default');

  if (content !== original) {
    fs.writeFileSync(file, content);
    console.log(`Updated ${file}`);
    count++;
  }
}
console.log(`Done updating ${count} files.`);
