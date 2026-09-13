import fs from 'fs';
import { globSync } from 'glob';

const files = globSync('src/**/*.{tsx,ts}');
const sizeClasses = [
  'text-xs', 'text-sm', 'text-base', 'text-lg', 'text-xl', 'text-2xl', 'text-3xl', 'text-4xl', 'text-5xl', 'text-6xl',
  'text-caption', 'text-body-sm', 'text-body', 'text-subheading', 'text-heading-sm', 'text-heading-lg', 'text-display'
];

let replaced = 0;

for (const file of files) {
  let content = fs.readFileSync(file, 'utf-8');
  let changed = false;

  // We want to find className="... text-heading ..."
  // We can use a regex that matches className attributes
  const regex = /className=(?:\{`|["'])(.*?)(?:`\}|["'])/g;
  let match;
  
  const replacements = [];
  
  while ((match = regex.exec(content)) !== null) {
    const classStr = match[1];
    
    // Check if it contains text-heading
    if (/\btext-heading\b/.test(classStr)) {
      // Check if it also has a size class
      const hasSizeClass = sizeClasses.some(cls => new RegExp(`\\b${cls}\\b`).test(classStr));
      
      // Check if it's used as a color modifier like hover:text-heading or dark:text-heading
      const hasModifier = /(?:hover|dark|focus|active|group-hover):text-heading\b/.test(classStr);
      
      if (!hasSizeClass && !hasModifier) {
        console.log(`Found missing size in ${file}: "${classStr}"`);
        
        // We will append text-heading-md
        // But wait, the word "text-heading" might already be there (for color).
        // So we just add text-heading-md before text-heading.
        const newClassStr = classStr.replace(/\btext-heading\b/, 'text-heading-md text-heading');
        
        replacements.push({
          oldStr: match[0],
          newStr: match[0].replace(classStr, newClassStr)
        });
      }
    }
  }
  
  for (const r of replacements) {
    content = content.replace(r.oldStr, r.newStr);
    changed = true;
    replaced++;
  }
  
  if (changed) {
    fs.writeFileSync(file, content);
  }
}

console.log(`Replaced ${replaced} occurrences.`);
