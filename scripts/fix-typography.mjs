import fs from 'fs';

function replaceInFile(file, replacer) {
  const content = fs.readFileSync(file, 'utf-8');
  const newContent = replacer(content);
  if (content !== newContent) {
    fs.writeFileSync(file, newContent);
    console.log(`Updated ${file}`);
  }
}

// 2. Page titles
replaceInFile('src/app/blog/[slug]/page.tsx', (content) => {
  return content.replace(/font-display text-4xl md:text-5xl font-bold mb-6 text-heading leading-tight tracking-tight/g, 'editorial-headline mb-6 text-heading');
});

replaceInFile('src/app/search/page.tsx', (content) => {
  return content.replace(/font-display text-4xl md:text-5xl font-bold text-center mb-12 text-heading/g, 'editorial-headline text-center mb-12 text-heading');
});

replaceInFile('src/app/not-found.tsx', (content) => {
  return content.replace(/text-8xl md:text-9xl font-display font-bold text-heading mb-4 tracking-tighter/g, 'editorial-headline mb-4 text-heading');
});

replaceInFile('src/app/error.tsx', (content) => {
  return content.replace(/text-8xl md:text-9xl font-display font-bold text-heading mb-4 tracking-tighter/g, 'editorial-headline mb-4 text-heading');
});

// 3. Eyebrows
replaceInFile('src/components/ui/HadithBanner.tsx', (content) => {
  return content.replace(/font-ui text-caption font-bold tracking-\[0\.2em\] mb-6 uppercase text-lime-sprout opacity-80/g, 'section-eyebrow mb-6 text-lime-sprout opacity-80');
});

replaceInFile('src/components/article/TableOfContents.tsx', (content) => {
  return content
    .replace(/font-ui text-body-sm font-bold tracking-wider uppercase mb-4 text-heading/g, 'section-eyebrow mb-4')
    .replace(/font-ui text-body-sm font-bold tracking-wider uppercase text-heading/g, 'section-eyebrow');
});

replaceInFile('src/components/layout/Footer.tsx', (content) => {
  return content.replace(/font-ui font-bold text-body-sm uppercase tracking-\[0\.02em\] text-heading mb-4/g, 'section-eyebrow mb-4');
});
