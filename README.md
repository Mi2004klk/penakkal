# Penakkal Blog Platform

This is the modernized frontend architecture for the **Penakkal** Islamic publishing platform, migrating from a legacy WordPress monolith to a lightning-fast, highly secure Next.js architecture (Vercel SSR/ISR mode).

## Tech Stack
- **Framework**: Next.js 16 (App Router + Turbopack)
- **Styling**: Tailwind CSS v4
- **State Management**: Zustand
- **Search**: Built-in static JSON manifest search (`search-manifest.json`)
- **Animations**: Framer Motion
- **Icons**: Lucide React

## Architecture & Data Pipeline

To eliminate the WordPress server entirely and maximize security, this platform processes legacy WordPress exports into an optimized data layer ahead of time.

### 1. Data Generation (`npm run data:all`)
Before the Next.js build runs, a suite of Node.js scripts processes the raw `source-data/blog_export.json` (a WordPress REST API dump):
- `scripts/process-json.mjs`: Parses the 20MB raw JSON, sanitizes the raw HTML using `cheerio` and `sanitize-html` to prevent XSS, identifies embedded Quran/Hadith references, and deterministically injects anchor IDs into headings.
- `scripts/categorize.mjs`: Categorizes articles based on keywords.
- `scripts/download-media.mjs`: Downloads, resizes, and optimizes all WordPress images into high-performance `.webp` formats.
- `scripts/generate-metadata.mjs`: Splits the monolithic JSON into optimal parts:
  1. `src/data/search-manifest.json`: A unified manifest for instantaneous client-side search.
  2. `src/data/articles-meta.json`: A lightweight array of all articles containing only titles, slugs, tags, and dates (used for global lists).
  3. `src/data/articles-content/`: Individual `.json` files for each article containing the heavy HTML bodies, only loaded when navigating to a specific article.

### 2. Next.js Build (`npm run build`)
Next.js builds the application using Vercel SSR/ISR, leveraging built-in image optimization (`next/image`) and dynamic routing.

## Development

```bash
# 1. First, process the raw WordPress data and media into the optimized format:
npm run data:all

# 2. Start the development server (uses Turbopack):
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Production Build

```bash
npm run build
```
This single command runs the data pipeline (`data:all`) and the Next.js build. The result is a highly optimized Next.js server ready to be deployed to Vercel (recommended) or any standard Next.js hosting environment.

## Security
- **Static Content**: No database or server-side execution.
- **Strict Headers**: `Strict-Transport-Security`, `X-Content-Type-Options`, and `Permissions-Policy` are enforced via `vercel.json`.
- **Sanitized HTML**: The build pipeline actively cleans legacy markup and prevents injection vectors.
