import fs from "node:fs/promises";
import crypto from "node:crypto";

const apiKey = process.env.GNEWS_API_KEY;
if (!apiKey) throw new Error("Missing GNEWS_API_KEY GitHub secret.");

const categories = ["world", "business", "entertainment", "sports"];
const base = "https://gnews.io/api/v4/top-headlines";
const all = [];
function cleanText(value) {
  return String(value || "")
    .replace(/\s*\[\d+\s+chars?\]\s*$/i, "")
    .replace(/\s+/g, " ")
    .trim();
}
function buildLongDescription(description, content) {
  const primary = cleanText(description);
  const secondary = cleanText(content);
  if (!secondary || secondary === primary) return primary;
  const sentences = secondary.split(/(?<=[.!?])\s+/).filter(Boolean);
  const additions = sentences.filter(sentence => !primary.includes(sentence)).slice(0, 3).join(" ");
  const combined = [primary, additions].filter(Boolean).join(" ");
  return combined.slice(0, 650).trim();
}
function fallbackImage(category) {
  return ({
    world: "news-world.svg",
    business: "news-business.svg",
    entertainment: "news-entertainment.svg",
    sports: "news-sports.svg"
  }[category] || "news-world.svg");
}


async function fetchCategory(url, category) {
  const maxAttempts = 3;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const response = await fetch(url);

    if (response.ok) return await response.json();

    if (response.status === 429) {
      const retryAfter = Number(response.headers.get("retry-after") || 0);
      const waitMs = retryAfter > 0
        ? Math.min(retryAfter * 1000, 15000)
        : Math.min(2000 * attempt, 10000);

      console.warn(`GNews rate limit for ${category} (429). Waiting ${waitMs}ms before retry ${attempt + 1}/${maxAttempts}.`);
      if (attempt < maxAttempts) await new Promise(resolve => setTimeout(resolve, waitMs));
      continue;
    }

    const body = await response.text();
    throw new Error(`GNews request failed for ${category}: ${response.status} ${response.statusText} ${body.slice(0, 300)}`);
  }

  console.warn(`Skipping ${category} because GNews is rate-limiting the request.`);
  return null;
}

for (const category of categories) {
  const url = new URL(base);
  url.searchParams.set("category", category);
  url.searchParams.set("lang", "en");
  url.searchParams.set("max", "10");
  url.searchParams.set("apikey", apiKey);

  const data = await fetchCategory(url, category);

  for (const item of data?.articles ?? []) {
    all.push({
      category,
      title: item.title ?? "",
      description: buildLongDescription(item.description, item.content),
      content: cleanText(item.content ?? item.description ?? ""),
      image: item.image || fallbackImage(category),
      url: item.url ?? "",
      publishedAt: item.publishedAt ?? null,
      source: item.source?.name ?? "Unknown source"
    });
  }

  // Keep requests spaced out to reduce provider rate-limit pressure.
  await new Promise(resolve => setTimeout(resolve, 1000));
}

// Editorial quality guard: keep the automatic homepage focused on useful news
// and remove obvious graphic/clickbait phrasing without trying to judge legitimate reporting.
const blockedPhrases = [
  /\\bgraphic(?: images?| footage)?\\b/i,
  /\\bgruesome (?:images?|footage|details)\\b/i,
  /\\bdead body\\b/i,
  /\\bgore\\b/i,
  /\\bnsfw\\b/i,
  /\\bexplicit (?:images?|video|footage)\\b/i,
  /\\bshocking (?:video|footage|images?)\\b/i,
  /\\bdisturbing (?:video|footage|images?)\\b/i,
  /\\byou won't believe\\b/i,
  /\\bclick here\\b/i,
  /\\bwatch (?:the )?shocking\\b/i
];

function passesEditorialFilter(item) {
  const text = [item.title, item.description].filter(Boolean).join(" ");
  return !blockedPhrases.some(pattern => pattern.test(text));
}

const seen = new Set();
const stories = all
  .filter(item => item.title && item.url)
  .filter(passesEditorialFilter)
  .filter(item => {
    const key = item.url;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  })
  .sort((a, b) => new Date(b.publishedAt || 0) - new Date(a.publishedAt || 0))
  .slice(0, 30)
  .map(item => ({
    id: crypto.createHash("sha256").update(item.url).digest("hex").slice(0, 16),
    ...item
  }));

// Never erase a working feed if the provider temporarily rate-limits every request.
if (!stories.length) {
  try {
    const existing = JSON.parse(await fs.readFile("data/news.json", "utf8"));
    if (Array.isArray(existing.stories) && existing.stories.length) {
      console.warn("No fresh stories returned. Keeping the existing news feed.");
      process.exit(0);
    }
  } catch {
    // No existing feed to preserve.
  }

  throw new Error("GNews returned no stories. Check the API plan, quota, key, or provider availability.");
}

await fs.mkdir("data", { recursive: true });
await fs.writeFile(
  "data/news.json",
  JSON.stringify({ updatedAt: new Date().toISOString(), source: "GNews API", stories }, null, 2) + "\n",
  "utf8"
);


const siteBase = "https://parshantsharma29102005-hue.github.io/Saffron-globe-news/";
const xmlEscape = value => String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
const sitemapUrls = [
  { loc: siteBase, lastmod: new Date().toISOString() },
  { loc: siteBase + "article.html", lastmod: new Date().toISOString() },
  ...stories.map(story => ({
    loc: siteBase + "article.html?auto=" + encodeURIComponent(story.id),
    lastmod: story.publishedAt || new Date().toISOString()
  }))
];
const newsCutoff = Date.now() - 48 * 60 * 60 * 1000;
const newsStories = stories.filter(story => {
  const published = Date.parse(story.publishedAt || "");
  return Number.isFinite(published) && published >= newsCutoff;
});
const sitemap = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">',
  `  <url><loc>${xmlEscape(siteBase)}</loc><lastmod>${xmlEscape(new Date().toISOString())}</lastmod></url>`,
  `  <url><loc>${xmlEscape(siteBase + "article.html")}</loc><lastmod>${xmlEscape(new Date().toISOString())}</lastmod></url>`,
  ...newsStories.map(story => {
    const published = new Date(story.publishedAt || new Date().toISOString()).toISOString();
    return `  <url><loc>${xmlEscape(siteBase + "article.html?auto=" + encodeURIComponent(story.id))}</loc><lastmod>${xmlEscape(published)}</lastmod><news:news><news:publication><news:name>Saffron Globe News</news:name><news:language>en</news:language></news:publication><news:publication_date>${xmlEscape(published)}</news:publication_date><news:title>${xmlEscape(story.title)}</news:title></news:news></url>`;
  }),
  '</urlset>',
  ''
].join("\n");
await fs.writeFile("sitemap.xml", sitemap, "utf8");
console.log(`Sitemap coverage: ${sitemapUrls.length} URLs; Google News entries: ${newsStories.length}`);

const imageCount = stories.filter(s => s.image).length;
console.log(`Saved ${stories.length} stories to data/news.json`);
console.log(`Image coverage: ${imageCount}/${stories.length} stories have an image source (fallbacks included).`);
if (imageCount !== stories.length) throw new Error("Image coverage check failed: every published story must have an image.");
