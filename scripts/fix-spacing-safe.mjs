import fs from 'fs';
import { globSync } from 'glob';

const files = globSync('src/**/*.{tsx,ts}');
let count = 0;

for (const file of files) {
  let content = fs.readFileSync(file, 'utf-8');
  let original = content;

  // 1. MetaSeparator replacements
  const dotRegex = /<span className="w-1 h-1 rounded-full[^>]*><\/span>/g;
  if (dotRegex.test(content)) {
    content = content.replace(dotRegex, '<MetaSeparator />');
    if (!content.includes('import MetaSeparator')) {
      content = 'import MetaSeparator from "@/components/ui/MetaSeparator";\n' + content;
    }
  }

  // 2. Card padding: p-4/p-5/p-8 -> p-6 (but only inside ArticleCard or when referring to cards)
  if (file.includes('ArticleCard.tsx')) {
    content = content.replace(/\bp-4\b/g, 'p-6');
    content = content.replace(/\bp-5\b/g, 'p-6');
    content = content.replace(/\bp-8\b/g, 'p-6');
    // Also Grid gaps
    content = content.replace(/\bgap-4\b/g, 'gap-6 md:gap-8');
  }

  // 3. Grid gaps: gap-8/gap-6/gap-4/gap-2 -> gap-6 md:gap-8 (in page.tsx, category, etc)
  // This is too broad to regex indiscriminately, but let's apply to Home block separation
  if (file.endsWith('app/page.tsx')) {
    content = content.replace(/gap-6 lg:gap-8/g, 'gap-6 md:gap-8');
    content = content.replace(/gap-8/g, 'gap-6 md:gap-8');
  }

  if (content !== original) {
    fs.writeFileSync(file, content);
    console.log(`Updated ${file}`);
    count++;
  }
}
console.log(`Done updating ${count} files.`);
