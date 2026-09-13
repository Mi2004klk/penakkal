import fs from 'fs';

function replaceInFile(file, replacer) {
  const content = fs.readFileSync(file, 'utf-8');
  const newContent = replacer(content);
  if (content !== newContent) {
    fs.writeFileSync(file, newContent);
    console.log(`Updated ${file}`);
  }
}

// 1. Remove manual containers and gaps in blog index
replaceInFile('src/app/blog/page.tsx', (content) => {
  return content
    .replace(/hasHero=\{true\}/g, '')
    .replace(/<div className="container mx-auto px-4 lg:px-8 pt-16 pb-24">/g, '<div>');
});

// 2. Article page
replaceInFile('src/app/blog/[slug]/page.tsx', (content) => {
  let newContent = content
    .replace(/<header className="container mx-auto px-4 pt-8 pb-8 max-w-4xl text-center">/g, '<header className="pt-8 max-w-4xl mx-auto text-center">')
    .replace(/<div className="container mx-auto px-4 max-w-5xl mb-16">/g, '<div className="max-w-5xl mx-auto mb-16">')
    .replace(/<div className="container mx-auto px-4 pb-20">/g, '<div className="pb-20">')
    .replace(/<span className="w-1\.5 h-1\.5 rounded-full bg-border-default"><\/span>/g, '<MetaSeparator />');
    
  if (newContent !== content && !newContent.includes('import MetaSeparator')) {
    newContent = 'import MetaSeparator from "@/components/ui/MetaSeparator";\n' + newContent;
  }
  return newContent;
});

// 3. Category & Tag pages
const listPages = [
  'src/app/category/page.tsx',
  'src/app/category/[slug]/page.tsx',
  'src/app/tag/[slug]/page.tsx',
  'src/app/author/[name]/page.tsx'
];

for (const file of listPages) {
  if (fs.existsSync(file)) {
    replaceInFile(file, (content) => {
      return content
        .replace(/<div className="container mx-auto px-4 py-16 md:py-24">/g, '<div>')
        .replace(/<div className="container mx-auto px-4 py-12 md:py-16">/g, '<div>')
        .replace(/<div className="container mx-auto px-4 relative z-10 text-center">/g, '<div className="relative z-10 text-center">')
        .replace(/hasHero=\{true\}/g, '');
    });
  }
}

// 4. Utility pages
const utilityPages = [
  'src/app/about/page.tsx',
  'src/app/history/page.tsx',
  'src/app/search/page.tsx',
  'src/app/saved/page.tsx'
];

for (const file of utilityPages) {
  if (fs.existsSync(file)) {
    replaceInFile(file, (content) => {
      return content
        .replace(/<div className="container mx-auto px-4 py-16 md:py-24 max-w-4xl">/g, '<div className="max-w-4xl mx-auto">')
        .replace(/<div className="container mx-auto px-4 py-16 md:py-24">/g, '<div>');
    });
  }
}
