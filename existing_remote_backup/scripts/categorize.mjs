import fs from 'fs/promises';
import path from 'path';

const DATA_PATH = path.resolve('src/data/articles.json');

const categoryKeywords = {
  'quran-tafsir':     ['தப்சீர்', 'குர்ஆன்', 'ஆயத்', 'சூரா', 'வஹீ', 'திருக்குர்ஆன்'],
  'hadith':           ['ஹதீஸ்', 'நபி கூறினார்', 'புகாரி', 'முஸ்லிம்', 'நபிகள் நாயகம்'],
  'fiqh':             ['பிக்ஹ்', 'ஹலால்', 'ஹராம்', 'ஃபர்ஸ்', 'வாஜிப்', 'மஸ்அலா'],
  'seerah':           ['சீரா', 'நபி வரலாறு', 'மக்கா', 'மதீனா', 'ஹிஜ்ரா'],
  'history':          ['வரலாறு', 'கலீஃபா', 'உஸ்மானிய', 'சுல்தான்', 'இஸ்லாமிய வரலாறு'],
  'spirituality':     ['தஸவ்வுஃப்', 'சூஃபி', 'ஆன்மீகம்', 'தக்வா', 'இஹ்ஸான்'],
  'family':           ['திருமணம்', 'குடும்பம்', 'குழந்தை', 'மஹர்', 'பெற்றோர்'],
  'ramadan':          ['ரமலான்', 'நோன்பு', 'ஸவ்ம்', 'இஃப்தார்', 'தராவீஹ்'],
  'hajj-umrah':       ['ஹஜ்', 'உம்ரா', 'கஅபா', 'அரஃபா', 'தவாஃப்'],
  'duas-dhikr':       ['துஆ', 'திக்ர்', 'பிரார்த்தனை', 'ஓதுதல்'],
  'youth':            ['இளையோர்', 'இளைஞர்', 'மாணவர்'],
  'society':          ['சமூகம்', 'சமுதாயம்', 'அரசியல்', 'நீதி'],
  'education':        ['கல்வி', 'அறிவு', 'மத்ரஸா', 'கற்றல்'],
  'ethics-morality':  ['ஒழுக்கம்', 'நல்லொழுக்கம்', 'பண்பு', 'அக்லாக்'],
  'women-in-islam':   ['பெண்கள்', 'முஸ்லிம் பெண்', 'ஹிஜாப்'],
  'islamic-finance':  ['ஜகாத்', 'ஸதகா', 'ரிபா', 'வட்டி', 'பொருளாதாரம்'],
  'stories':          ['கதை', 'நபிமார்கள் கதை', 'சம்பவம்'],
  'current-affairs':  ['நடப்பு', 'செய்தி', 'சர்வதேச'],
  'aqeedah':          ['அகீதா', 'ஈமான்', 'தௌஹீத்', 'நம்பிக்கை'],
};

const categoryTamilNames = {
  'quran-tafsir':     'குர்ஆன் தப்சீர்',
  'hadith':           'ஹதீஸ்',
  'fiqh':             'பிக்ஹ்',
  'seerah':           'சீரா',
  'history':          'இஸ்லாமிய வரலாறு',
  'spirituality':     'ஆன்மீகம்',
  'family':           'குடும்பம்',
  'ramadan':          'ரமலான்',
  'hajj-umrah':       'ஹஜ் & உம்ரா',
  'duas-dhikr':       'துஆ & திக்ர்',
  'youth':            'இளையோர்',
  'society':          'சமூகம்',
  'education':        'கல்வி',
  'ethics-morality':  'ஒழுக்கம்',
  'women-in-islam':   'இஸ்லாத்தில் பெண்கள்',
  'islamic-finance':  'இஸ்லாமிய பொருளாதாரம்',
  'stories':          'கதைகள்',
  'current-affairs':  'நடப்பு நிகழ்வுகள்',
  'aqeedah':          'அகீதா',
  'general':          'பொதுவான',
};

async function callGemini(title, contentExcerpt, apiKey) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
  
  const categoriesList = Object.entries(categoryTamilNames)
    .filter(([slug]) => slug !== 'general')
    .map(([slug, tamilName]) => `"${slug}" (${tamilName})`)
    .join(', ');

  const payload = {
    contents: [
      {
        parts: [
          {
            text: `Given this Tamil Islamic article title: "${title}"
And first 500 chars: "${contentExcerpt}"

Assign exactly ONE category from this list: ${categoriesList}
Extract 3-8 Tamil tags.

Return JSON in this format:
{
  "category": "category-slug-here",
  "tags": ["tag1", "tag2", "tag3"]
}`
          }
        ]
      }
    ],
    generationConfig: {
      responseMimeType: "application/json",
      temperature: 0.1,
    }
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(`Gemini API Error: ${response.status} ${errorData}`);
  }

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  
  if (!text) throw new Error('No text returned from Gemini API');
  
  return JSON.parse(text);
}

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function run() {
  console.log('Categorizing articles using keyword matching and AI fallback...');
  const rawData = await fs.readFile(DATA_PATH, 'utf-8');
  const articles = JSON.parse(rawData);
  
  let keywordAssignedCount = 0;
  let aiAssignedCount = 0;
  let aiFailedCount = 0;
  
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn('\n⚠️ WARNING: GEMINI_API_KEY is not set. The script will only use keyword matching, and unmatched articles will default to "general".\n');
  }

  for (const [index, article] of articles.entries()) {
    const contentExcerpt = (article.content || '').replace(/<[^>]*>?/gm, '').substring(0, 500);
    const textToSearch = (article.title + ' ' + article.excerpt + ' ' + contentExcerpt).toLowerCase();
    
    let matchedCategory = 'general';
    let maxMatches = 0;
    
    // Tier 1: Keyword Matching
    for (const [slug, keywords] of Object.entries(categoryKeywords)) {
      let matches = 0;
      for (const kw of keywords) {
        if (textToSearch.includes(kw.toLowerCase())) {
          matches++;
        }
      }
      if (matches > maxMatches) {
        maxMatches = matches;
        matchedCategory = slug;
      }
    }
    
    // Extract tags from keywords as baseline
    const tags = new Set();
    for (const keywords of Object.values(categoryKeywords)) {
      for (const kw of keywords) {
        if (textToSearch.includes(kw.toLowerCase())) {
          tags.add(kw);
        }
      }
    }

    if (matchedCategory !== 'general') {
      keywordAssignedCount++;
      article.category = matchedCategory;
      article.categoryTamil = categoryTamilNames[matchedCategory];
      article.tags = Array.from(tags).slice(0, 8);
    } else {
      // Tier 2: AI Fallback
      if (apiKey) {
        console.log(`[${index + 1}/${articles.length}] Requesting AI classification for: ${article.title.substring(0, 50)}...`);
        try {
          // Rate limit protection (free tier is 15 RPM)
          if (aiAssignedCount > 0 && aiAssignedCount % 10 === 0) {
            console.log('Rate limit pause... waiting 10s');
            await delay(10000);
          } else {
            await delay(2000); // 2s between requests to be safe
          }

          const aiResult = await callGemini(article.title, contentExcerpt, apiKey);
          
          article.category = categoryTamilNames[aiResult.category] ? aiResult.category : 'general';
          article.categoryTamil = categoryTamilNames[article.category] || 'பொதுவான';
          
          if (Array.isArray(aiResult.tags)) {
            aiResult.tags.forEach(t => tags.add(t));
          }
          article.tags = Array.from(tags).slice(0, 8);
          
          aiAssignedCount++;
          console.log(`  -> AI Assigned: ${article.categoryTamil} | Tags: ${article.tags.join(', ')}`);
        } catch (error) {
          console.error(`  -> ❌ AI Fallback failed for "${article.title}":`, error.message);
          aiFailedCount++;
          
          // Fallback to general
          article.category = 'general';
          article.categoryTamil = 'பொதுவான';
          article.tags = Array.from(tags).slice(0, 8);
        }
      } else {
        // If no API key, stick to general
        article.category = 'general';
        article.categoryTamil = 'பொதுவான';
        article.tags = Array.from(tags).slice(0, 8);
      }
    }
  }
  
  // Mark top 6 non-general articles as featured
  let featuredCount = 0;
  for (const article of articles) {
    if (article.category !== 'general' && article.coverImage && featuredCount < 6) {
      article.featured = true;
      featuredCount++;
    }
  }
  
  await fs.writeFile(DATA_PATH, JSON.stringify(articles, null, 2));
  
  console.log('\n=======================================');
  console.log('🎉 Categorization Complete!');
  console.log(`Total Articles:    ${articles.length}`);
  console.log(`Keyword Matched:   ${keywordAssignedCount}`);
  if (apiKey) {
    console.log(`AI Categorized:    ${aiAssignedCount}`);
    console.log(`AI Failed:         ${aiFailedCount}`);
  } else {
    console.log(`General (No AI):   ${articles.length - keywordAssignedCount}`);
  }
  console.log(`Featured Articles: ${featuredCount}`);
  console.log('=======================================\n');
}

run().catch(console.error);
