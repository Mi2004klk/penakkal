# Phase 1 Import Scripts

Run these scripts in order after migrating the DB to seed the database with the file-based data:

1. `npx tsx scripts/import/import-settings.ts` (Phase 2 - seeds admin user)
2. `npx tsx scripts/import/import-taxonomy.ts`
3. `npx tsx scripts/import/import-authors.ts`
4. `npx tsx scripts/import/import-articles.ts`
5. `npx tsx scripts/import/import-media.ts`
6. `npx tsx scripts/import/qa-report.ts`
