import fs from 'fs';
import { globSync } from 'glob';

const files = globSync('src/**/*.{tsx,ts}');
let count = 0;

for (const file of files) {
  let content = fs.readFileSync(file, 'utf-8');
  let original = content;

  // Add line-clamp-1 to author display in ArticleCard
  if (file.includes('ArticleCard.tsx')) {
    content = content.replace(/<span className="flex items-center gap-1\.5 group-hover:text-heading transition-colors">/g, '<span className="flex items-center gap-1.5 group-hover:text-heading transition-colors line-clamp-1">');
    // For the list view author
    content = content.replace(/<span className="font-medium truncate">/g, '<span className="font-medium line-clamp-1">');
  }

  // Home page hero author
  if (file.includes('page.tsx') && !file.includes('app/')) {
    // Wait, home page is app/page.tsx
  }
  if (file.endsWith('app/page.tsx')) {
    content = content.replace(/<span className="font-medium">\{heroArticle\.author\}<\/span>/g, '<span className="font-medium line-clamp-1 max-w-[200px]">{heroArticle.author}</span>');
  }

  // Blog article author
  if (file.includes('blog/[slug]/page.tsx')) {
    content = content.replace(/\{article\.author\}/g, '<span className="line-clamp-1 max-w-[250px]">{article.author}</span>');
  }

  // feed.xml/route.ts
  if (file.includes('feed.xml/route.ts')) {
    content = content.replace(/<dc:creator><!\[CDATA\[\$\{article\.author\}\]\]><\/dc:creator>/g, '<dc:creator><![CDATA[${article.author.substring(0, 80)}]]></dc:creator>');
  }

  if (content !== original) {
    fs.writeFileSync(file, content);
    console.log(`Updated ${file}`);
    count++;
  }
}
console.log(`Done updating ${count} files.`);
