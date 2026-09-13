import fs from 'fs';
import path from 'path';

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

function luminance(r, g, b) {
  const a = [r, g, b].map(function (v) {
    v /= 255;
    return v <= 0.03928
      ? v / 12.92
      : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

function contrast(hex1, hex2) {
  const rgb1 = hexToRgb(hex1);
  const rgb2 = hexToRgb(hex2);
  const lum1 = luminance(rgb1.r, rgb1.g, rgb1.b);
  const lum2 = luminance(rgb2.r, rgb2.g, rgb2.b);
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  return (brightest + 0.05) / (darkest + 0.05);
}

const matrix = [
  // Light Mode
  { theme: 'light', bg: '#ffffff', fg: '#000000', name: 'pure-white-card / heading', min: 4.5 },
  { theme: 'light', bg: '#ffffff', fg: '#44403b', name: 'pure-white-card / body-text', min: 4.5 },
  { theme: 'light', bg: '#ffffff', fg: '#4d4843', name: 'pure-white-card / muted-text', min: 4.5 },
  { theme: 'light', bg: '#ffffff', fg: '#008236', name: 'pure-white-card / text-link', min: 4.5 },
  
  { theme: 'light', bg: '#fcf7ed', fg: '#000000', name: 'cream-paper / heading', min: 4.5 },
  { theme: 'light', bg: '#fcf7ed', fg: '#44403b', name: 'cream-paper / body-text', min: 4.5 },
  { theme: 'light', bg: '#fcf7ed', fg: '#4d4843', name: 'cream-paper / muted-text', min: 4.5 },
  { theme: 'light', bg: '#fcf7ed', fg: '#008236', name: 'cream-paper / text-link', min: 4.5 },

  { theme: 'light', bg: '#0d542b', fg: '#ffffff', name: 'forest-stage / pure-white', min: 4.5 },
  { theme: 'light', bg: '#0d542b', fg: '#b9ff78', name: 'forest-stage / lime-sprout', min: 4.5 },

  { theme: 'light', bg: '#f54320', fg: '#000000', name: 'ember-coral button / true-black label', min: 4.5 },

  // Dark Mode
  { theme: 'dark', bg: '#212121', fg: '#f3f4f6', name: 'pure-white-card / heading', min: 4.5 },
  { theme: 'dark', bg: '#212121', fg: '#d1d5db', name: 'pure-white-card / body-text', min: 4.5 },
  { theme: 'dark', bg: '#212121', fg: '#9ca3af', name: 'pure-white-card / muted-text', min: 4.5 },
  { theme: 'dark', bg: '#212121', fg: '#b9ff78', name: 'pure-white-card / text-link', min: 4.5 },

  { theme: 'dark', bg: '#171717', fg: '#f3f4f6', name: 'cream-paper / heading', min: 4.5 },
  { theme: 'dark', bg: '#171717', fg: '#d1d5db', name: 'cream-paper / body-text', min: 4.5 },
  { theme: 'dark', bg: '#171717', fg: '#9ca3af', name: 'cream-paper / muted-text', min: 4.5 },
  { theme: 'dark', bg: '#171717', fg: '#b9ff78', name: 'cream-paper / text-link', min: 4.5 },

  { theme: 'dark', bg: '#0d542b', fg: '#ffffff', name: 'forest-stage / pure-white', min: 4.5 },
  { theme: 'dark', bg: '#0d542b', fg: '#b9ff78', name: 'forest-stage / lime-sprout', min: 4.5 },

  // Dark Mode — raw-palette tokens remapped for legibility (stone/ash/surface-alt)
  { theme: 'dark', bg: '#212121', fg: '#a8a29e', name: 'pure-white-card / stone (dark remap)', min: 4.5 },
  { theme: 'dark', bg: '#171717', fg: '#a8a29e', name: 'cream-paper / stone (dark remap)', min: 4.5 },
  { theme: 'dark', bg: '#1e1e1e', fg: '#a8a29e', name: 'surface-card / stone (dark remap)', min: 4.5 },
  { theme: 'dark', bg: '#2a2a2a', fg: '#f3f4f6', name: 'surface-alt (dark) / heading', min: 4.5 },
  { theme: 'dark', bg: '#2a2a2a', fg: '#d1d5db', name: 'surface-alt (dark) / body-text', min: 4.5 },
  { theme: 'dark', bg: '#2a2a2a', fg: '#9ca3af', name: 'surface-alt (dark) / muted-text', min: 4.5 },
  { theme: 'dark', bg: '#008236', fg: '#ffffff', name: 'moss badge / pure-white label', min: 4.5 }
];

let failed = false;

console.log("Validating WCAG Contrast...");
for (const check of matrix) {
  const ratio = contrast(check.bg, check.fg);
  if (ratio < check.min) {
    console.error(`❌ FAIL: [${check.theme}] ${check.name} (BG: ${check.bg}, FG: ${check.fg}) - Ratio: ${ratio.toFixed(2)}:1 (Min: ${check.min})`);
    failed = true;
  } else {
    console.log(`✅ PASS: [${check.theme}] ${check.name} - Ratio: ${ratio.toFixed(2)}:1`);
  }
}

if (failed) {
  process.exit(1);
} else {
  console.log("All contrast checks passed.");
}
