import fs from 'fs';
import path from 'path';
import { globSync } from 'glob';

const files = globSync('src/**/*.{tsx,ts}');

let totalRemoved = 0;
let modifiedFiles = 0;

files.forEach(file => {
  const content = fs.readFileSync(file, 'utf-8');
  
  // Regex to match any class starting with dark:
  // Examples: dark:bg-slate, dark:text-ash, dark:hover:border-lime-sprout, dark:hover:bg-slate/50
  // It handles everything until the next space, quote, or backtick
  const newContent = content.replace(/\bdark:[a-zA-Z0-9-:/\[\]\.]+/g, (match) => {
    totalRemoved++;
    return '';
  });
  
  // Clean up double spaces left behind inside class strings
  // We use a regex that looks for multiple spaces and replaces with single space
  // This is safe to run on TSX files because it mostly affects class strings
  const cleanedContent = newContent.replace(/className=(["'`])(.*?)(\1)/g, (match, quote, classes, quoteEnd) => {
    return `className=${quote}${classes.replace(/\s+/g, ' ').trim()}${quoteEnd}`;
  });

  if (content !== cleanedContent) {
    fs.writeFileSync(file, cleanedContent, 'utf-8');
    modifiedFiles++;
    console.log(`Modified ${file}`);
  }
});

console.log(`\n🎉 Swept ${totalRemoved} dark: classes across ${modifiedFiles} files.`);
