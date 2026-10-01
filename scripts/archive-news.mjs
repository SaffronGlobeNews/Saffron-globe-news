import fs from "node:fs/promises";

const archiveDir = "data/archive";
const siteBase = "https://parshantsharma29102005-hue.github.io/Saffron-globe-news/";
await fs.mkdir(archiveDir, { recursive: true });

function localDateKey(value) {
  const date = new Date(value || Date.now());
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).format(Number.isNaN(date.getTime()) ? new Date() : date);
}

function mergeStories(...groups) {
  const byUrl = new Map();
  for (const group of groups) {
    for (const story of Array.isArray(group) ? group : []) {
      if (!story?.url) continue;
      byUrl.set(story.url, { ...(byUrl.get(story.url) || {}), ...story });
    }
  }
  return [...byUrl.values()]
    .filter(story => story.title && story.url)
    .sort((a, b) => new Date(b.publishedAt || 0) - new Date(a.publishedAt || 0));
}

async function readJson(path, fallback) {
  try { return JSON.parse(await fs.readFile(path, "utf8")); }
  catch { return fallback; }
}

const current = (await readJson("data/news.json", {})).stories || [];
if (!current.length) throw new Error("No current stories found to archive.");

const groups = new Map();
for (const story of current) {
  const dateKey = localDateKey(story.publishedAt);
  if (!groups.has(dateKey)) groups.set(dateKey, []);
  groups.get(dateKey).push(story);
}

for (const [dateKey, stories] of groups) {
  const path = `${archiveDir}/${dateKey}.json`;
  const existing = (await readJson(path, {})).stories || [];
  await fs.writeFile(path, JSON.stringify({
    date: dateKey,
    stories: mergeStories(existing, stories)
  }, null, 2) + "\n", "utf8");
}

const archiveFiles = (await fs.readdir(archiveDir))
  .filter(name => /^\\d{4}-\\d{2}-\\d{2}\\.json$/.test(name))
  .sort((a, b) => b.localeCompare(a));

const index = { updatedAt: new Date().toISOString(), dates: [], stories: {} };
const allStories = [];

for (const file of archiveFiles) {
  const dateKey = file.replace(".json", "");
  index.dates.push(dateKey);
  const day = await readJson(`${archiveDir}/${file}`, {});
  for (const story of day.stories || []) {
    if (!story.id) continue;
    index.stories[story.id] = dateKey;
    allStories.push(story);
  }
}

await fs.writeFile("data/news-archive-index.json", JSON.stringify(index, null, 2) + "\n", "utf8");

const xmlEscape = value => String(value)
  .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
  .replace(/"/g, "&quot;").replace(/'/g, "&apos;");

const unique = mergeStories(allStories);
const newsCutoff = Date.now() - 48 * 60 * 60 * 1000;
const urls = [
  `  <url><loc>${xmlEscape(siteBase)}</loc><lastmod>${new Date().toISOString()}</lastmod></url>`,
  `  <url><loc>${xmlEscape(siteBase + "article.html")}</loc><lastmod>${new Date().toISOString()}</lastmod></url>`,
  `  <url><loc>${xmlEscape(siteBase + "archive.html")}</loc><lastmod>${new Date().toISOString()}</lastmod></url>`,
  `  <url><loc>${xmlEscape(siteBase + "editorial.html")}</loc></url>`,
  `  <url><loc>${xmlEscape(siteBase + "privacy.html")}</loc></url>`
];

for (const story of unique) {
  const published = Date.parse(story.publishedAt || "");
  const publishedIso = Number.isFinite(published)
    ? new Date(published).toISOString()
    : new Date().toISOString();
  const articleUrl = siteBase + "article.html?auto=" + encodeURIComponent(story.id);
  if (published >= newsCutoff) {
    urls.push(`  <url><loc>${xmlEscape(articleUrl)}</loc><lastmod>${xmlEscape(publishedIso)}</lastmod><news:news><news:publication><news:name>Saffron Globe News</news:name><news:language>en</news:language></news:publication><news:publication_date>${xmlEscape(publishedIso)}</news:publication_date><news:title>${xmlEscape(story.title)}</news:title></news:news></url>`);
  } else {
    urls.push(`  <url><loc>${xmlEscape(articleUrl)}</loc><lastmod>${xmlEscape(publishedIso)}</lastmod></url>`);
  }
}

await fs.writeFile("sitemap.xml", [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">',
  ...urls,
  '</urlset>',
  ''
].join("\n"), "utf8");

console.log(`Archived ${current.length} current stories across ${index.dates.length} day files; total archive stories: ${unique.length}`);
